import { Directive, HostListener, Input } from '@angular/core';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';

@Directive({
  selector: '[appExportData]',
})
export class ExportDataDirective {
  @Input('appExportData') elementIdOrContent: string;
  @Input('type') type: SupportedExtensions;
  @Input() orientation: 'portrait' | 'landscape';

  exportPdfConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: '',
  };
  constructor(
    private exportAsService: ExportAsService
    ) {}

  @HostListener('click', ['$event'])
  exportData() {
  // console.log(this.type);

    if (this.type === 'pdf') {
      this.exportPdfConfig.elementIdOrContent = this.elementIdOrContent;
      if (!!this.orientation) {
        this.exportPdfConfig['options'] = {
          jsPDF: { orientation: this.orientation }
        }
      }
      this.exportAsService
        .save(this.exportPdfConfig, new Date().toDateString())
        .subscribe(() => {
        // console.log('Saved');
        });
    } else {
      let config: ExportAsConfig = {
        type: this.type,
        elementIdOrContent: this.elementIdOrContent
      }
      this.exportAsService
        .save(config, new Date().toDateString())
        .subscribe(() => {
        // console.log('Saved');
        });
    }
  }
}
