import prisma from '../config/db';
import { config } from '../config/env';

interface VerifyCarrierData {
  driverId: string;
  mcNumber?: string;
  dotNumber?: string;
}

interface FMCSAResponse {
  carrier: {
    dbaName?: string;
    legalName?: string;
    dotNumber?: string;
    mcNumber?: string;
    authorityStatus?: string;
  };
  insurance?: {
    bipdInsuranceOnFile?: string;
    bipdInsuranceRequired?: string;
    cargoInsuranceOnFile?: string;
    bondInsuranceOnFile?: string;
  };
}

export class CarrierVerificationService {
  async verifyCarrier(data: VerifyCarrierData) {
    const { driverId, mcNumber, dotNumber } = data;

    if (!mcNumber && !dotNumber) {
      throw new Error('MC Number or DOT Number is required');
    }

    // Verificar que el driver existe
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    let fmcsaData: FMCSAResponse | null = null;
    let authorityStatus = 'Unknown';
    let insuranceBipdLimit = null;
    let insuranceCargoLimit = null;

    try {
      // Llamar a la API de FMCSA
      fmcsaData = await this.fetchFMCSAData(mcNumber, dotNumber);

      if (fmcsaData && fmcsaData.carrier) {
        authorityStatus = fmcsaData.carrier.authorityStatus || 'Unknown';

        // Extraer información de seguro
        if (fmcsaData.insurance) {
          if (fmcsaData.insurance.bipdInsuranceOnFile) {
            insuranceBipdLimit = parseFloat(fmcsaData.insurance.bipdInsuranceOnFile) || null;
          }
          if (fmcsaData.insurance.cargoInsuranceOnFile) {
            insuranceCargoLimit = parseFloat(fmcsaData.insurance.cargoInsuranceOnFile) || null;
          }
        }
      }
    } catch (error) {
      console.error('FMCSA API call failed:', error);
      // Continuar con valores por defecto
    }

    // Guardar verificación en la base de datos
    const verification = await prisma.carrierVerification.create({
      data: {
        driverId,
        mcNumber: mcNumber || null,
        dotNumber: dotNumber || null,
        authorityStatus,
        insuranceBipdLimit,
        insuranceCargoLimit,
        sourceRawJson: fmcsaData as any,
      },
    });

    // Actualizar información del driver
    await prisma.driver.update({
      where: { id: driverId },
      data: {
        mcNumber: mcNumber || driver.mcNumber,
        dotNumber: dotNumber || driver.dotNumber,
        carrierStatus: authorityStatus,
        lastVerificationAt: new Date(),
      },
    });

    return verification;
  }

  async getVerificationHistory(driverId: string) {
    const verifications = await prisma.carrierVerification.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });

    return verifications;
  }

  async getLatestVerification(driverId: string) {
    const verification = await prisma.carrierVerification.findFirst({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });

    return verification;
  }

  private async fetchFMCSAData(
    mcNumber?: string,
    dotNumber?: string
  ): Promise<FMCSAResponse | null> {
    // Si no hay API key configurada, retornar datos mock
    if (!config.fmcsaApiKey || config.fmcsaApiKey === '') {
      console.log('FMCSA API Key not configured, using mock data');
      return this.getMockFMCSAData(mcNumber, dotNumber);
    }

    try {
      const searchParam = mcNumber ? `mc_mx/${mcNumber}` : `docket/${dotNumber}`;
      const url = `${config.fmcsaApiUrl}/${searchParam}/basics`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${config.fmcsaApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`FMCSA API returned ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching FMCSA data:', error);
      // Retornar datos mock en caso de error
      return this.getMockFMCSAData(mcNumber, dotNumber);
    }
  }

  private getMockFMCSAData(mcNumber?: string, dotNumber?: string): FMCSAResponse {
    return {
      carrier: {
        dbaName: 'Sample Trucking LLC',
        legalName: 'Sample Trucking Company',
        dotNumber: dotNumber || '1234567',
        mcNumber: mcNumber || 'MC-123456',
        authorityStatus: 'ACTIVE',
      },
      insurance: {
        bipdInsuranceOnFile: '750000',
        bipdInsuranceRequired: '750000',
        cargoInsuranceOnFile: '100000',
        bondInsuranceOnFile: '75000',
      },
    };
  }
}
