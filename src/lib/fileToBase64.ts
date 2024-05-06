export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => { resolve(`${fileReader.result}`); };
    fileReader.onerror = (error) => { reject(error); };
  });
}