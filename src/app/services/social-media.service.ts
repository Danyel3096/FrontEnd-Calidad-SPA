import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SocialMediaInfo {
  WhatsAppUrl: string;
  FacebookUrl: string;
  XTwitterUrl: string;
  ThreadsUrl: string;
  PinterestUrl: string;
  LinkedInUrl: string;
  YouTubeUrl: string;
  InstagramUrl: string;
  RedditUrl: string;
  SnapchatUrl: string;
  TumblrUrl: string;
  VimeoUrl: string;
  GooglePlusUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class SocialMediaService {
  private readonly social_media = signal<SocialMediaInfo | null>(null);

  constructor(private http: HttpClient) {
    this.loadSocialMediaInfo();
  }

  getSocialMedia(): Signal<SocialMediaInfo | null> {
    return this.social_media;
  }

  private loadSocialMediaInfo(): void {
    this.http
      .get<SocialMediaInfo>('assets/config/social_media.json')
      .subscribe((data) => this.social_media.set(data));
  }
}
