import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Users } from '../auth/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environmentAlbum } from '../environments/environment.prod';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(private http : HttpClient, private authService : AuthService){}

  ngOnInit():void {
    this.fetchUsers();
  }


  usersList : Users[] = [];

  private fetchUsers(){
    this.http.get<{[key:string]: Users}>('https://gm-infinite-scroll-default-rtdb.europe-west1.firebasedatabase.app/Users.json')
    .pipe(map((res) => {
      const users = [];
      for(const key in res){
        if(res.hasOwnProperty(key)){
          users.push({...res[key], id : key})
        }
      }
      return users;
    }))
    .subscribe((users) => {
      this.usersList = users;
      console.log(users)
    })
  }


}
