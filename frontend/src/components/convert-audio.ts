export const convert = (audioFileData: any, targetFormat: any, title: any) => {
  try {
    targetFormat = targetFormat.toLowerCase();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = function (event: any) {
        const contentType = 'audio/' + targetFormat;
        const data = event.target.result.split(',');
        const b64Data = data[1];
        const blob = getBlobFromBase64Data(b64Data, contentType);
        // const blobUrl = URL.createObjectURL(blob);

        const convertedAudio = {
          name: title,
          format: targetFormat,
          data: blob,
        };
        // console.log("convertedImage: ", convertedImage);
        resolve(convertedAudio);
      };
      reader.readAsDataURL(audioFileData);
    });
  } catch (e) {
    console.log('Error occurred while converting : ', e);
  }
};

function getBlobFromBase64Data(
  b64Data: any,
  contentType: any,
  sliceSize = 512
) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
