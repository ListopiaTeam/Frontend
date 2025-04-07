# Listopia Documentation
- *Please note that this project is still work in progress*

## Requirements
- Modern Web Browser
    - Currently the website works best on larger screens but most of it is usable on mobile as well
- Active Internet Connection
- Registration To Access All Features (Email, Username, Password & Optional Profile Picture)
    - Account and content made by users can be deleted by the user themselves or by moderators

## Features & Usage Guide

- ### Lists
    - ***The Main Feature & Purpose Of The Site***
    - Creating A List:
        - Automatically Selected Image From The First Game Contained In The List
        - Tags
        - Title
        - Description
        - Games
        - Option To Submit To Current Event

- ### Events

- ### Social Features
    - #### Commenting & Replying

    - #### Liking Content

- ### Moderation
    - #### How To Become A Moderator / Admin
        - Add ```isAdmin``` boolean to the user with ```true``` value

    - #### Reporting Content

    - #### Moderator Tools

- ### User Profile
    - #### Profile Settings
        - Set Username
        - Set Profile Picture
        - Delete Account

    - #### Own Lists
        - Shows lists made by the current user logged in
        - Ordered by creation date (From most recent to older)

    - #### Liked Lists
        - Shows liked lists of the current user logged in
        - Ordered by like count (From most liked to least likes)

## How It Works
- ### Services Used
    - Firebase (Database & Auth)
    - RAWG API (Game Data)
    - Cloudinary (Image Hosting)

- ### Frontend
    - #### Hosting: Netlify (Free Tier)
        - Automatically updates when changes are made to this repository

    - #### Technologies:
        - Frameworks:
            - React
            - TailwindCSS + HyperUI
        - Other packages (React Query, Axios etc...)
        - Vite (Build Tool & Dev Server)
        - Bun (Package Management)
        - Prettier (Code Formatting)

- ### Backend
    - #### Hosting: Self-hosting at home (Linux Server with Docker Containers)
        - Automatically updates when changes are made to the backend repository
        - Has custom domain