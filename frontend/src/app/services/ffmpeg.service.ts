import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private ffmpge;

  constructor() {
    this.ffmpge = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpge.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;

    const data = await fetchFile(file);

    this.ffmpge.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        // input:
        '-i',
        file.name,

        // output options:
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',

        // Output:
        `output${second}.png`
      );
    });

    await this.ffmpge.run(...commands);

    const screenshots: string[] = [];

    seconds.forEach((second) => {
      const screenshotFile = this.ffmpge.FS('readFile', `output${second}.png`);
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png',
      });

      const screenshotURL = URL.createObjectURL(screenshotBlob);

      screenshots.push(screenshotURL);
    });

    this.isRunning = false;

    return screenshots;
  }

  async blobFromURL(url: string): Promise<Blob> {
    const response = await fetch(url);
    const blob = response.blob();

    return blob;
  }
}
