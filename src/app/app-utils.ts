
export class Utils {


  public static getReadableFileSizeString(fileSizeInBytes: number): string {
    var i = -1;
    var byteUnits = [' Ko', ' Mo', ' Go', ' To', 'Po', 'Eo', 'Zo', 'Yo'];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }


  public static download(file: Blob, filename: string) {
    var url = window.URL.createObjectURL(file);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
  }

}

