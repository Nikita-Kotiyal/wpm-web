import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-o-auth-callback',
  templateUrl: './o-auth-callback.component.html',
  styleUrls: ['./o-auth-callback.component.css']
})
export class OAuthCallbackComponent {

  public provider : any = null;
  public token : any = null;
  
  constructor(private route: ActivatedRoute) { }


  
  ngOnInit() {
    // Get the auth provider 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.provider = params.get('provider')
    });
    
    // Get the token after successfully logged in.
    this.route.queryParams
      .subscribe(params => {
        this.token = params?.['id_token'];
      }
    );

    if(this.token && this.provider){
      // fetch the jwt token from strapi for the logged in user.
      this.fetchTheJwt();
    }
  }

  fetchTheJwt(){
    axios
      .get(`http://localhost:1337/api/auth/${this.provider}/callback?access_token=${this.token}`, {
    
      })
      .then(response => {
        
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response);
      });
  }

}
