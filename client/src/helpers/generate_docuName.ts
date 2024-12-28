export function generateRandomDocumentName(extension: string) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10; 
    
    let result = '';
    
    // Use crypto to generate random bytes
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    // Map the random bytes to our characters string
    for (let i = 0; i < length; i++) {
        result += characters[array[i] % characters.length];
    }
  
    return result + extension;
  }
  