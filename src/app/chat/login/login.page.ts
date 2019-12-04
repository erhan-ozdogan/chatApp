import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {FirestoreServiceService} from '../../services/firebase/firestore-service.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import { Platform } from "@ionic/angular";



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user={username:"erhan11",
              name:"erhan",
              password:"123",
              surname:"ozdogan",
              phone:"1231321321"
              };

registerForm:FormGroup;
  constructor(private fb:FormBuilder,
              private router:Router,
              private fbService:FirestoreServiceService,
              private auth:AuthenticationService,
              private plt:Platform) { 


  };

  ngOnInit() {

    
    this.registerForm =this.fb.group({
      name: ['',Validators.required],
      surname: ['',Validators.required],
      username: ['',Validators.required],
      password:['',Validators.required],
      phone: ['',Validators.required],


    });
  }

  register(){
    console.log(this.registerForm.value);
    this.user=this.registerForm.value;
    this.fbService.addUser(this.user).then(()=>{
      this.auth.writeLocal(this.user.phone);
      this.router.navigateByUrl('chat/contact');
          
    });
  }


}
