﻿import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  records: string;

  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE',
    pageTitleContent: '学习记录',
  };

  importSettings = {
    page: 'import',
    pageTitleContent: '导入',
  };

  exportSettings = {
    page: 'export',
    pageTitleContent: '导出',
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitleContent: string = '设置';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public translate: TranslateService) {
  }

  load() {
    let confirm = this.alertCtrl.create({
      title: "您确定吗？",
      message: '如果学习记录代码无效，所有数据均可能会丢失。此操作不可撤销。',
      buttons: [
        {
          text: '确定',
          handler: () => {
            try {
              let rwords = JSON.parse(this.records);
              localStorage.setItem("rwords", JSON.stringify(rwords));
              let alert = this.alertCtrl.create({
                title: '恢复记录成功！',
                buttons: ['确定']
              });
              alert.present();
            } catch (err) {
              let alert = this.alertCtrl.create({
                title: '恢复记录失败',
                subTitle: '有可能是因为记录代码无效，请检查后重试！',
                buttons: ['确定']
              });
              alert.present();
            }
          }
        },
        {
          text: '取消'
        }
      ]
    });
    confirm.present();
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  gotoLegacySite() {
    let confirm = this.alertCtrl.create({
      title: '确认吗?',
      message: '是否确认要回到老版本，老版本并未为iOS系统优化，可能会发生不可恢复的错误，如果出现这样的情况，可以考虑杀掉进程重新打开。',
      buttons: [
        {
          text: '否',
          handler: () => { }
        },
        {
          text: '是',
          handler: () => {
            window.location.href = "assets/site/index.html?cordova=true";
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
    this.pageTitleContent = this.navParams.get('pageTitleContent') || this.pageTitleContent;

    // this.translate.get(this.pageTitleKey).subscribe((res) => {
    //   this.pageTitle = res;
    // })
    this.pageTitle = this.pageTitleContent;

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  getRecords() {
    this.records = localStorage.getItem("rwords");
  }

  paste() {
  }
}
