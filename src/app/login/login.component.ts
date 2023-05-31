import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { GenericResponse } from '../shared/types/generic-response';
import { LoginService } from './login.service';
import { Howl, Howler } from 'howler';
import { CommonService } from '../services/common.service';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  siteName = environment.siteName;
  isCaptcha:boolean = environment.isCaptcha;

  fullSiteName = window.location.hostname.replace('www.', '').replace('exch4.', '');


  imageSrc: any;

  loginForm: FormGroup;
  isPasswordVisible: boolean = false;
  loginStatus: GenericResponse<any>;
  isSubmitted: boolean = false;
  errorMsg: string;
  disableLogin: boolean;

  playing: boolean = false;
  @ViewChild('loginButton') loginButton: ElementRef;
  @ViewChild('userName') userName: ElementRef;

  // @ViewChild('audioOption') audioPlayerRef: ElementRef;
  soundOn: boolean = true;
  sound: Howl;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private titleService: Title,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private commonService: CommonService,
    private settingsService: SettingsService

  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('WEEXCH666');
    this.commonService.apis$.subscribe((res) => {
      console.log(this.isCaptcha);
      
      if (this.isCaptcha) {
        this.getImg();
      }
    });
    this.loginForm = this.formBuilder.group({
      userName: this.formBuilder.control('', Validators.required),
      password: ['', Validators.required],
      captcha: [this.isCaptcha ? '' : '0000', Validators.required],
      log: [this.isCaptcha ? '' : '0000', Validators.required]
    });

    if (!this.isCaptcha) {
      this.loginForm.addControl('origin', new FormControl(this.getDomainName(location.origin)));
    }

    // this.addChat();
    // this.onAudioPlay();

    // this.sound = new Howl({
    //   src: ['../assets/audio/ipl_tone.mp3']
    // });

    // this.sound.play()
  }

  getDomainName(hostName) {
    let formatedHost = "";
    let splithostName = hostName.split('.');
    if (splithostName.length > 2) {
      formatedHost = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
    } else {
      formatedHost = hostName.split('//')[1]
    }
    return formatedHost;
  }

  toggleSound() {
    if (this.soundOn) {
      this.sound.pause();
      this.soundOn = false;
    } else {
      this.sound.play();
      this.soundOn = true;
    }
  }

  ngAfterViewInit() {
    // var audio = <HTMLAudioElement>document.getElementById('player');
    // audio.src = "../assets/audio/ipl_tone.mp3";
    // audio.load();
    // audio.play();
    // (<any>x).play();
    // this.onAudioPlay();
    // this.playAudio();
  }

  // playAudio() {
  //   let audio = new Audio();
  //   audio.src = '../assets/audio/ipl_tone.mp3';
  //   audio.load();
  //   audio.play();
  // }

  // onAudioPlay() {
  //   this.audioPlayerRef.nativeElement.play();
  // }

  // muteAudio() {
  //   this.playing = true;
  //   if (this.playing) {
  //     (<any>document.getElementById('player')).play();
  //     this.playing = true;
  //     $('#mute-unmute').empty();
  //     $('#mute-unmute').append(
  //       '<img id="button" src="unmute.png" style="height: 35px;cursor: pointer;">'
  //     );
  //   } else {
  //     (<any>document.getElementById('player')).pause();
  //     this.playing = false;
  //     $('#mute-unmute').empty();
  //     $('#mute-unmute').append(
  //       '<img id="button" src="white-mute.png" style="height: 35px;cursor: pointer;">'
  //     );
  //   }
  // }

  passVisibleClicked() {
    if (this.isPasswordVisible == false) this.isPasswordVisible = true;
    else if (this.isPasswordVisible == true) this.isPasswordVisible = false;
  }

  getImg() {
    this.loginService
      .getImg()
      .subscribe((response: { img: string; log: string }) => {
        this.imageSrc = response.img;
        document
          .getElementById('authenticateImage')
          .setAttribute('src', this.getSecureImage(response.img));
        this.loginForm.get('log').setValue(response.log);
      });
  }

  getSecureImage(img) {
    return `data:image/jpeg;base64, ${img}`;
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.renderer.setAttribute(
        this.loginButton.nativeElement,
        'disabled',
        'disabled'
      );
      this.authService
        .login(this.loginForm.value)
        .subscribe((res: GenericResponse<any>) => {
          // res={"errorCode":0,"errorDescription":null,"result":[{"userId":394309,"userStatus":0,"parentId":314566,"userName":"j0511","name":"","balance":1227.93,"token":"4CD5E8BA0008790D333E697246C26E01","loginTime":"3/30/2023 6:39:14 AM","conversion":1,"creditRef":1000,"userType":8,"rules":null,"currencyCode":"HKD","stakeSetting":"5,10,50,100,500,1000,5000,10000,50000,100000","newUser":1}]}
          this.loginStatus = res;
          if (res.errorCode === 0) {
            this.tokenService.setToken(res.result[0].token);
            this.tokenService.setUserInfo(res.result[0]);


            if (res.result[0].stakeSetting) {

              let stakeSettingSplit = res.result[0].stakeSetting.split(',');
              let stakeList = [];

              stakeSettingSplit.forEach((element, index) => {
                if (index < 7) {
                  stakeList.push({ id: index + 1, stake: parseInt(element) })
                }
              });

              this.settingsService.setStakeList(stakeList);
            }
            this.authService.setCurrentUser(res.result[0]);
            this.authService.setLoggedIn(true);
            // this.router.navigateByUrl('/');
            if (res.result[0].newUser == 1) {
              this.router.navigateByUrl('/changepassword');
            } else {
              window.location.href = '/';
            }
          } else {
            this.userName.nativeElement.focus();
            this.loginForm.reset();
            this.renderer.removeAttribute(
              this.loginButton.nativeElement,
              'disabled',
              null
            );
            this.isSubmitted = false;
            this.errorMsg = res.errorDescription;
            if (this.isCaptcha) {
              this.getImg();
            }
          }
        });
    }
  }

  public get f(): FormGroup {
    return this.loginForm;
  }

  // addChat() {
  //   let script: HTMLScriptElement = this.renderer.createElement('script');
  //   script.type = 'text/javascript';
  //   script.id = 'chatScript';
  //   script.innerHTML = `
  //   var Tawk_API = Tawk_API || {},
  //       Tawk_LoadStart = new Date();
  //     (function () {
  //       var s1 = document.createElement("script"),
  //         s0 = document.getElementsByTagName("script")[0];
  //       s1.async = true;
  //       s1.src = "https://embed.tawk.to/605dbea8f7ce182709343107/1f1n31gu9";
  //       s1.charset = "UTF-8";
  //       s1.setAttribute("crossorigin", "*");
  //       s0.parentNode.insertBefore(s1, s0);
  //     })();
  //   `;

  //   this.renderer.appendChild(this._document.body, script);
  // }

  togglePass() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  ngOnDestroy() {
    // this._document.body.removeChild(
    //   this._document.getElementById('chatScript')
    // );
  }
}
