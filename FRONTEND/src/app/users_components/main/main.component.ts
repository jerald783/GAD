import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { SignalRService } from '../../../services/signalr.service';



@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit, OnDestroy {
    constructor(
    private service: UserService,
    private toastr: ToastrService,
    private signalRService: SignalRService
  ) { }
  EventsList: any[] = [];
  private destroy$ = new Subject<void>();
  newPost: string = '';
  userPosts: any[] = [];
  currentDate: Date = new Date();
  showPostCard: boolean = false;
  isMobile: boolean = false;
  showGadReminder = false;


  ngOnInit(): void {
    this.getUserPosts();
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));

    // Show GAD Reminder only if mobile
    if (this.isMobile) {
      this.showGadReminder = true;
      setTimeout(() => {
        this.showGadReminder = false;
      }, 4000); // hide after 3 seconds
    }
    //signalR
    this.signalRService.startConnection();
    this.signalRService.newPost$.subscribe(data => {
      if (data) {
        this.getUserPosts(); // Always fresh and consistent
      }
    });



  }


  getUserPosts(): void {
    this.service.getUserPost()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts) => {
          // Sort descending by Posid (or DatePosted if available)
          this.userPosts = posts.sort((a: any, b: any) => b.Posid - a.Posid);
        },
        error: () => {
          this.toastr.error('Failed to fetch user posts.');
        }
      });
  }


  addPost(): void {
    if (!this.newPost.trim()) {
      this.toastr.warning('Post content cannot be empty.');
      return;
    }

    const payload = {
      UserPosts: this.newPost
    };

    console.log('Sending to API:', payload);

    this.service.addUserpost(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Post added:', res);
          this.toastr.success('Post added successfully!');
          this.newPost = '';
          this.getUserPosts();
        },
        error: (err) => {
          console.error('Post failed:', err);
          this.toastr.error('Failed to add post.');
        }
      });
  }

  checkScreen() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // If switched to mobile and GAD reminder not shown yet
    if (this.isMobile && !wasMobile) {
      this.showGadReminder = true;
      setTimeout(() => {
        this.showGadReminder = false;
      }, 4000);
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const myButton = document.getElementById('myBtn');
    if (myButton) {
      myButton.style.display = window.scrollY > 20 ? 'block' : 'none';
    }
  }


  topFunction(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  reactToPost(post: any, reaction: string): void {
  switch (reaction) {
    case 'like':
      post.likes = (post.likes || 0) + 1;
      break;
    case 'love':
      post.loves = (post.loves || 0) + 1;
      break;
    case 'wow':
      post.wows = (post.wows || 0) + 1;
      break;
  }

  // Optional: Send to API
  // this.http.post('/api/userposts/react', { postId: post.id, reaction }).subscribe();
}

}
