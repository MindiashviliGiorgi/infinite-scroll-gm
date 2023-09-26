import { Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../auth/auth';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {

  user: Users;
  friendsList : Users[] = [];
  filteredList : Users[] = [];
  pageSize : number = 3;
  currentPage : number = 1;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private elementRef: ElementRef,
    ) {}

   // single user data
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.http.get<Users>(`https://gm-infinite-scroll-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}.json`)
        .subscribe((userData) => {
          this.user = userData;
        });
    };
    this.loadFriends(this.currentPage)
  }

  //fetch friends data
  loadFriends(page : number){
     this.http.get('https://gm-infinite-scroll-default-rtdb.europe-west1.firebasedatabase.app/Users.json')
     .pipe(
      map((res) => {
        const friends = [];
        const startIndex = (page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        let count = 0;

        for(const key in res) {
          if(res.hasOwnProperty(key) && count < endIndex) {
            if(count >= startIndex) {
              friends.push({...res[key], id: key});
            }
            count ++;
          }
        }
        return friends;
      })
     )
     .subscribe((fetchedFriends) => {
      this.friendsList = this.friendsList.concat(fetchedFriends);
    });
  }

  // scroll function
  @HostListener('window:scroll')
  onScroll(): void {
    if(window.innerHeight + window.scrollY >= this.elementRef.nativeElement.offsetHeight){
      this.currentPage++;
      this.loadFriends(this.currentPage)
    }
  }
}
