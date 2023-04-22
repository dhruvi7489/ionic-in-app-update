import { Component, ElementRef, NgZone, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoService } from 'src/app/core/services/video.service';
import { ProfileService } from '../profile.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { Observable, ReplaySubject } from 'rxjs';
import * as moment from 'moment';
import { Apiurl } from 'src/app/core/route';
import { S3Util } from 'src/app/core/util/s3.util';
import { HttpErrorResponse } from '@angular/common/http';
import { S3Object } from 'src/app/core/modal/s3-object.modal';
import { CommonProvider } from 'src/app/core/common';
import { Storage } from '@ionic/storage';

declare var MediaRecorder: any;

@Component({
  selector: 'app-introduction-video-add-edit',
  templateUrl: './introduction-video-add-edit.page.html',
  styleUrls: ['./introduction-video-add-edit.page.scss'],
})
export class IntroductionVideoAddEditPage implements OnInit {
  video: any;
  videoBase64: any;

  mediaRecorder: MediaRecorder;
  videoPlayer: any;
  isRecording = false;
  vides = [];
  @ViewChild('video') captureElement: ElementRef;

  constructor(
    public profileService: ProfileService,
    public sanitizer: DomSanitizer,
    public videoService: VideoService,
    private mediaCapture: MediaCapture,
    public zone: NgZone,
    public commonProvider: CommonProvider,
    public storage: Storage
  ) {


  }

  ngOnInit() {
  }

  uploadIntroductionVideo() {
    this.profileService.selectIntoVideoUploadOptions();
  }

  deleteIntroductionVideo() {
    this.videoBase64 = null;
    this.profileService.deleteIntroductionVideo();
  }

  async changeFile(event) {
    this.video = event.ngModelData
    this.videoBase64 = event.ngModelData
  }

  // Senitize Url
  cleanURL(): SafeUrl {
    if (this.videoBase64) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoBase64);
    } else {
      return "";
    }
  }

  fileChangeEvent(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.videoBase64 = reader.result;
    }
  }












  async recordVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      },
      audio: true
    })

    this.captureElement.nativeElement.srcObject = stream;
    this.isRecording = true;
    const options = {
      mimeType: 'video/webm',
      state: 'active',
    }
    this.mediaRecorder = new MediaRecorder(stream, options)
    let chunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    this.mediaRecorder.onstop = async (stop) => {
      const videoBuffer = new Blob(chunks, { type: 'video/webm' })
      // store video 
    }
  }


  stopRecord() {
    // if (this.mediaRecorder.state == 'inactive') return;/
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.captureElement.nativeElement.srcObject = null;
    this.isRecording = false;
  }

  playVideo() {

  }


  recordVideo1() {
    console.log("callll")
    // let options: CaptureVideoOptions = { duration: 1000, quality: 100 }
    // this.mediaCapture.captureVideo(options)
    //   .then(
    //     async (mediafile: MediaFile[]) => {
    //       console.log(mediafile);
    //       const imageData = mediafile[0].fullPath;
    //       await window[`resolveLocalFileSystemURL`](imageData,
    //         entry => {
    //           entry[`file`](async (file) => {
    //             const reader = new FileReader();
    //             reader.onloadend = async (evt: any) => {
    //               console.log(evt, "++++++++++++")
    //               const fileBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
    //               console.log("fileBlob", fileBlob)
    //               file.name = 'Video_' + moment().format('YYYYMMDD') + new Date().getTime() + '.' + file.type.split('/')[1];
    //               // let obj: any = {
    //               //   data: this.win.Ionic.WebView.convertFileSrc(imageData),
    //               //   status: 'V',
    //               //   filepath: imageData,
    //               //   name: file.name,
    //               //   blob: fileBlob,
    //               //   blobUrl: this.sanitizeLocalUrl(URL.createObjectURL(fileBlob)),
    //               //   thumbnail: await this.createThumbnail(imageData)
    //               // };
    //             };
    //             console.log(file)
    //             await reader.readAsArrayBuffer(file);
    //           });
    //         });
    //     }).catch((err: CaptureError) => {
    //       console.log(err);
    //     })
    this.zone.run(() => {
      let options: CaptureVideoOptions = { limit: 1 };
      this.mediaCapture.captureVideo(options).then(async (mediafile: MediaFile[]) => {
        console.log("mediafile----", mediafile)
        const imageData = mediafile[0].fullPath;
        window[`resolveLocalFileSystemURL`](imageData,
          entry => {
            console.log("entry----", entry)
            entry[`file`](async (file) => {
              console.log("calllllll", file)
              let reader = new FileReader();
              // reader.onloadend = async (evt: any) => {
              //   console.log("evt", evt)
              //   const fileBlob = new Blob([evt.target.result], { type: 'video/mp4' });
              //   console.log(fileBlob)
              //   file.name = 'Video_' + moment().format('YYYYMMDD') + new Date().getTime() + '.' + file.type.split('/')[1];


              //   // var reader1 = new FileReader();
              //   // reader1.readAsDataURL(fileBlob);
              //   // reader1.onloadend = function () {
              //   //   var base64data = reader1.result;
              //   //   console.log(base64data);
              //   // }
              // };
              reader.onload = function (ev) {
                console.log("++++", ev)
              }
              reader.onloadend = function (ev) {
                console.log("_____", ev)
              }
              reader.onloadstart = function (ev) {
                console.log("))))", ev)
              }
              reader.onabort = function (ev) {
                console.log("((((((((", ev)
              }
              reader.onloadend = function (ev) {
                console.log("&&&&&&&", ev)
              }
              reader.onprogress = function (ev) {
                console.log("******", ev)
              }
              reader.onerror = function (ev) {
                console.log("^^^^^^^^^^^", ev)
              }
              console.log("file---", file)
              reader.readAsArrayBuffer(file);


              var encode1 = btoa(JSON.stringify(file))
              console.log("encoded", encode1)

              const blob = new Blob([file], { type: 'video/mp4' })
              console.log("blob-------", blob);

              let s3Object: S3Object = null;
              const formData = new FormData();
              let filename = "VIDEO-rQql3.mp4";
              const loginUserId = await this.storage.get('loginUserId');
              formData.append('id', loginUserId);
              formData.append('profile', blob, filename);

              this.commonProvider.PostMethod(Apiurl.UploadProfilePicture + loginUserId, formData).then(async (res: S3Object) => {
                if (res) {
                  this.zone.run(() => {
                    s3Object = res;
                    console.log(res, S3Util.getFileUrl(res))
                    // this.profile_picture = S3Util.getFileUrl(res);
                    this.commonProvider.PutMethod(Apiurl.UpdateIntroVideo + loginUserId, s3Object.key).then(async (res: any) => {
                      if (res) {
                      }
                    }).catch((err: HttpErrorResponse) => {
                      console.log(err);
                    })
                  })
                }
              }).catch((err: HttpErrorResponse) => {
                console.log(err);
              })

              // this.handleUpload(file);
            });
          }, (error: any) => console.log('Something went wrong---', error)
        );
      },
        (error: CaptureError) => console.log('Something went wrong', error)
      );
    })
  }
}
