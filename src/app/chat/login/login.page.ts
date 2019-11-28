import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {FirestoreServiceService} from '../../services/firebase/firestore-service.service';
import {user} from '../../services/SQLite/sqlite.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import { Platform } from "@ionic/angular";



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:user={username:"erhan11",
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

   /* this.plt.ready().then(()=>{
      this.auth.isRegister().then(res =>{
        console.log(res);
        if(res){
          this.goto();
        }

      });
    });*/
    
    this.registerForm =this.fb.group({
      name: ['',Validators.required],
      surname: ['',Validators.required],
      username: ['',Validators.required],
      password:['',Validators.required],
      phone: ['',Validators.required],


    });
  }
  goto(){
    this.router.navigate(['chat/main']);
  }
  register(){
    console.log(this.registerForm.value);
    this.user=this.registerForm.value;
    this.fbService.addUser(this.user).then(()=>{
      this.auth.writeLocal();
      this.router.navigate(['chat/main']);
          
    });
  }


}
