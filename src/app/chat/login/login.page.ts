import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {FirestoreServiceService} from '../../services/firebase/firestore-service.service';
import {user} from '../../services/SQLite/sqlite.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:user={btAddress:"aa:bb:bb:cc:dd",
              username:"erhan11",
              name:"erhan",
              surname:"ozdogan",
              phone:"1231321321",
              loginInfo:"false"
              };

registerForm:FormGroup;
  constructor(private fb:FormBuilder,
              private router:Router,
              private fbService:FirestoreServiceService,
              private auth:AuthenticationService) { 


  };

  ngOnInit() {
    

    this.registerForm =this.fb.group({
      name: ['',Validators.required],
      surname: ['',Validators.required],
      username: ['',Validators.required],
      phone: ['',Validators.required],
      btAddress:['',Validators.required],
      loginInfo:['false']

    });
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
