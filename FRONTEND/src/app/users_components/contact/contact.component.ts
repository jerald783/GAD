import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import emailjs from 'emailjs-com';
@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent  implements OnInit{

  ngOnInit(): void {
    this.loadProfile()
  }
  incidentForm: FormGroup;
  email: string | null = null;
  constructor(
    private fb: FormBuilder,
  

  ) {
    this.incidentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      incidentDate: ['', Validators.required],
      details: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.incidentForm.valid) {
      const templateParams = {
        fullName: this.incidentForm.value.fullName,
        email: this.incidentForm.value.email,
        incidentDate: this.incidentForm.value.incidentDate,
        details: this.incidentForm.value.details
      };

      //  EmailJS service ID, template ID, and user ID
emailjs.send('service_mk9mmws', 'template_pvvaxvf', templateParams, 'G5hXul6GvkQYGjV3i')
.then(() => {
          alert('Incident report submitted successfully.');
          this.incidentForm.reset(); 
        }, (error) => {
          alert('Failed to submit the incident report: ' + JSON.stringify(error));
        });
    }
  }

  loadProfile() {
  }
  
}
