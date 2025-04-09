# Listopia Documentation

![Listopia](./public/Listopia_Icon_v2_big.png)

- *Please note that this project is still work in progress*
- The website is available at: [https://listopia-frontend.netlify.app](https://listopia-frontend.netlify.app)

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
    - These are made so users can collectively submit to one current theme
    - Top 3 liked lists are separated from the rest
    - There is a deadline for submission and only newly created lists can participate
        - After the deadline is over, events get archived

- ### Social Features

    - #### Commenting & Replying
        - Users are able to comment under lists and are even able to reply under them
            - Comments and replies have the commenter's username, profile picture and the comment's creation date attached
        - Replies are limited to one level only to keep the comment section simple
            - Replies are hidden by default and can be viewed by clicking the "**View *```amount of replies```* reply / replies**" button

    - #### Liking Content
        - Lists can be liked by users
            - Some example reasons why a user would use liking:
                - Show appreciation to / agreement with the creator
                - Help ranking lists in events
                - Add the list to liked lists page as a "save for later feature" / "reminder"

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