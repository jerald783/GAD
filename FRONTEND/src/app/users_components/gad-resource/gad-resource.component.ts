import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-gad-resource',
  standalone: false,

  templateUrl: './gad-resource.component.html',
  styleUrl: './gad-resource.component.scss'
})
export class GadResourceComponent  {

  resources = [
    {
      title: 'Legal & Policy Documents',
      items: [
        { name: 'RA 9710 - Magna Carta of Women', link: '/assets/docs/RA9710.pdf' },
        { name: 'Local GAD Code', link: '/assets/docs/gad-code.pdf' },
        { name: 'PCW Guidelines', link: '/assets/docs/pcw-guidelines.pdf' }
      ]
    },
    {
      title: 'Planning & Budgeting Tools',
      items: [
        { name: 'GAD Plan and Budget Template', link: '/assets/docs/gpb-template.docx' },
        { name: 'GAD Accomplishment Report Template', link: '/assets/docs/gad-ar-template.docx' }
      ]
    },
    {
      title: 'Training & Learning Materials',
      items: [
        { name: 'Gender Sensitivity Slides', link: '/assets/docs/gst-slides.pptx' },
        { name: 'Webinar Recordings', link: 'https://youtube.com/yourwebinar' }
      ]
    },
    {
      title: 'Forms and Downloads',
      items: [
        { name: 'Activity Proposal Form', link: '/assets/forms/activity-form.docx' },
        { name: 'VAW Report Form', link: '/assets/forms/vaw-form.docx' }
      ]
    },
    {
      title: 'External Links',
      items: [
        { name: 'Philippine Commission on Women', link: 'https://pcw.gov.ph' },
        { name: 'DILG GAD Portal', link: 'https://gad.dilg.gov.ph' }
      ]
    }
  ];
}