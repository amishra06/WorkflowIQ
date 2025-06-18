import CryptoJS from 'crypto-js';
import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from '@aws-sdk/client-kms';

export class EncryptionService {
  private static instance: EncryptionService;
  private kmsClient: KMSClient;
  private readonly keyId: string;

  private constructor() {
    this.kmsClient = new KMSClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      }
    });
    this.keyId = import.meta.env.VITE_AWS_KMS_KEY_ID;
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async encryptData(data: any): Promise<{ encryptedData: string; encryptedKey: string }> {
    try {
      // Generate a data key using KMS
      const { Plaintext, CiphertextBlob } = await this.kmsClient.send(
        new GenerateDataKeyCommand({
          KeyId: this.keyId,
          KeySpec: 'AES_256'
        })
      );

      // Encrypt the data using the data key
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        Buffer.from(Plaintext).toString('base64')
      ).toString();

      return {
        encryptedData,
        encryptedKey: Buffer.from(CiphertextBlob).toString('base64')
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  async decryptData(encryptedData: string, encryptedKey: string): Promise<any> {
    try {
      // Decrypt the data key using KMS
      const { Plaintext } = await this.kmsClient.send(
        new DecryptCommand({
          CiphertextBlob: Buffer.from(encryptedKey, 'base64')
        })
      );

      // Decrypt the data using the decrypted data key
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        Buffer.from(Plaintext).toString('base64')
      ).toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  encryptField(value: string, key: string): string {
    return CryptoJS.AES.encrypt(value, key).toString();
  }

  decryptField(encryptedValue: string, key: string): string {
    return CryptoJS.AES.decrypt(encryptedValue, key).toString(CryptoJS.enc.Utf8);
  }

  hashValue(value: string): string {
    return CryptoJS.SHA256(value).toString();
  }
}

export const encryptionService = EncryptionService.getInstance();