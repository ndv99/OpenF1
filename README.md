# OpenF1

A web interface for generating charts and graphs of Formula One session data, using functions from the [Fast-F1 Python Library](https://github.com/theOehrly/Fast-F1).

## Accessing the site

You can view the site at https://openf1.nick-dv.com

## Contributing

We welcome any contributions to this project, it's a lot of work for just two devs!

All of our frontend code is written in TypeScript for NextJS (React), and our backend is written as a Django REST API in Python.

We try to use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) for our pull requests, have a quick read of the summary and you should be ready to get started. Example PR title:

`feat(API): Get all available years with telemetry` <-- This PR would represent an **API** **feat**ure, which implements an endpoint to fetch all years that have complete telemetry data

### Getting Started

You'll need the following things installed first:
- [Python](https://www.python.org/downloads/) (>=3.10.4)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
- [NodeJS](https://nodejs.org/en/download/)
  - [(On Linux)](https://github.com/nvm-sh/nvm)

Once you've installed these, fork this repository to your own account, and then clone it to your system.

#### Backend

*N.B: If you only plan on altering the front-end, you can skip this section, **although we highly reccomend running your own backend locally.***

1. In a terminal, navigate to the parent directory containing the OpenF1 folder.
2. Create a virtual environment by running `python3 -m venv OpenF1`, then navigate into the OpenF1 directory
3. Now you need to activate the environment.

    Linux/MacOS:
    ```bash
    source bin/activate
    ```

    Windows:
    ```
    Scripts\activate
    ```
4. Install the project requirements with `pip install -r requirements.txt`
5. You can run the backend server with `python manage.py runserver`. Requests can be made to `http://localhost:8000/api/`

#### Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

1. In your terminal, navigate to the `frontend` directory in the repository.
2. Run `yarn install` to install the project dependencies.
    
    *2a. (Optional) If you skipped the backend setup, create a file called `.env.local` in the frontend directory, and paste the following code into it:*
    ```env
    NEXT_PUBLIC_QUERY_URL = https://openf1-api.herokuapp.com
    ```
    *This will tell your frontend instance to use the production API.*
3. Run the website using `yarn dev`
4. Open `http://localhost:3000` with your browser to see the result.


Once you've written some code and you're ready to submit it for review, push your branch up to GitHub and create a pull request. Fill out the template (deleting any unneeded sections) and we'll review it as soon as we can.
