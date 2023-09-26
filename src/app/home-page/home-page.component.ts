import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, } from '@angular/core';
import { Users } from '../auth/auth';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(private http: HttpClient, private elementRef: ElementRef) {}

  usersList: Users[] = [];
  pageSize: number = 3;
  currentPage: number = 1;
  loading: boolean = false;

  ngOnInit(): void {
    this.loadItems(this.currentPage);
  }
  //fetch data
  loadItems(page: number) {
    if (this.loading) {
      return;
    } 
    this.loading = true;
    this.http
      .get('https://gm-infinite-scroll-default-rtdb.europe-west1.firebasedatabase.app/Users.json')
      .pipe(
        map((res) => {
          const users = [];
          const startIndex = (page - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          let count = 0;

          for (const key in res) {
            if (res.hasOwnProperty(key) && count < endIndex) {
              if (count >= startIndex) {
                users.push({ ...res[key], id: key });
              }
              count++;
            }
          }
          return users;
        })
      )
      .subscribe((fetchedUsers) => {
        this.usersList = this.usersList.concat(fetchedUsers);
        this.loading = false;
      }); 
  }

  //scroll Function
  @HostListener('window:scroll')
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= this.elementRef.nativeElement.offsetHeight) {
      this.currentPage++;
      this.loadItems(this.currentPage);
    };
  };

}
