import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../auth/auth';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  user: Users | undefined;
  potentialFriends : Users[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.http.get<Users>(`https://gm-infinite-scroll-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}.json`)
        .subscribe((userData) => {
          this.user = userData;
        });
    };
  }

  

  

}
