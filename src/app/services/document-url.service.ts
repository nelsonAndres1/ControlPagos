import { Injectable } from '@angular/core';
import { global } from './global';

@Injectable({
  providedIn: 'root'
})
export class DocumentUrlService {
  build(filename: string): string {
    const token = localStorage.getItem('token') || '';
    const normalizedFilename = (filename || '').trim();
    const encodedFilename = encodeURIComponent(normalizedFilename);
    const encodedToken = encodeURIComponent(token);
    return `${global.url}teso12/getDocumento/${encodedFilename}?token=${encodedToken}`;
  }
}
