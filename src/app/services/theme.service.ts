    // theme.service.ts
    import { Injectable } from '@angular/core';
    import { BehaviorSubject } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class ThemeService {
      private _theme = new BehaviorSubject<string>('light');
      readonly theme$ = this._theme.asObservable();

      toggleTheme() {
        const currentTheme = this._theme.value;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this._theme.next(newTheme);
        document.body.setAttribute('data-theme', newTheme); // Update body attribute
        localStorage.setItem('theme', newTheme); // Persist theme
      }

      loadTheme(theme?: string) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          this._theme.next(savedTheme);
          document.body.setAttribute('data-theme', savedTheme);
        } else {
          // Optional: Detect system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialTheme = prefersDark ? 'dark' : (theme ? theme :'light');
          this._theme.next(initialTheme);
          document.body.setAttribute('data-theme', initialTheme);
        }
        // Listen to system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const newTheme = e.matches ? 'dark' : 'light';
          this._theme.next(newTheme);
          document.body.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
        });
      }

      getTheme() {
        return this._theme.getValue();
      }
    }
