

# EventMgr - Event Management System

## 📌 Project Description
**EventMgr** is a full-stack web application designed to streamline the process of creating, managing, and booking events. It features a robust backend for handling data integrity and a responsive frontend for a smooth user experience.

**Key Features:**
* **User Authentication:** Secure Registration and Login (Token-based Auth).
* **Role-Based Access:** Organizers can create events; Attendees can view and book.
* **Dynamic Ticketing:** Real-time calculation of remaining tickets.
* **Ticket Tiers:** Support for Standard, VIP, and Backstage passes.
* **Booking System:** Users can book tickets and view their history in "My Tickets".
* **Cancellation:** Users can cancel bookings, automatically freeing up seats for others.
* **Visual Feedback:** Sold-out and Past events are visually distinct and unclickable.

## 🛠 Technologies Used

**Backend:**
* Python 3.x
* Django
* Django REST Framework (DRF)
* SQLite (Database)
* Django CORS Headers

**Frontend:**
* React.js
* React Router DOM
* CSS3 (Custom Styling)

---

## 📂 Project Structure

```text
EventMgr/
├── event_project/          # Django Backend
│   ├── event/              # Main App (Models, Views, Serializers)
│   ├── system/             # Project Settings & URLs
│   ├── db.sqlite3          # Database file
│   ├── requirements.txt    # Python Dependencies
│   └── manage.py           # Django CLI utility
│
├── frontend/               # React Frontend
│   ├── public/             # Static files (index.html, images)
│   ├── src/                # React Source Code
│   │   ├── components/     # (Optional if you structured it this way)
│   │   ├── App.js          # Main Component & Routing
│   │   ├── EventList.js    # Homepage / List View
│   │   ├── EventDetails.js # Booking Page
│   │   ├── Login.js        # Auth Page
│   │   └── ...             # Other components
│   └── package.json        # Dependencies
│
└── README.md

```

---

## 🚀 How to Run the Project

### 1. Backend Setup (Django)

Open a terminal in the `event_project` directory.

1. **Create a virtual environment:**
```bash
python -m venv venv

```


2. **Activate the environment:**
* *Windows:* `venv\Scripts\activate`
* *Mac/Linux:* `source venv/bin/activate`


3. **Install Dependencies:**
```bash
pip install -r requirements.txt

```


4. **Prepare the Database:**
*(Run these two commands to initialize the database and tables)*
```bash
python manage.py makemigrations
python manage.py migrate

```


5. **Create a Superuser (Admin/Organizer):**
```bash
python manage.py createsuperuser

```


6. **Run the Server:**
```bash
python manage.py runserver

```


*The backend will run at `http://127.0.0.1:8000/*`

### 2. Frontend Setup (React)

Open a **new** terminal in the `frontend` directory.

1. **Install Node Modules:**
```bash
npm install

```


*(Note: You need Node.js installed on your machine)*.

2. **Start the Application:**
```bash
npm start

```


*The frontend will run at `http://localhost:3000/*`

---

## 🔗 API Endpoints

The backend exposes the following REST API endpoints:

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/login/` | User login & Token retrieval | Public |
| **POST** | `/users/register/` | Register a new user | Public |
| **GET** | `/events/` | List all upcoming events | Authenticated |
| **POST** | `/events/` | Create a new event | Admin/Organizer |
| **GET** | `/events/<id>/` | Get details of a specific event | Authenticated |
| **GET** | `/registrations/` | List logged-in user's bookings | Authenticated |
| **POST** | `/registrations/` | Book a ticket (Standard/VIP/etc) | Authenticated |
| **DEL** | `/registrations/<id>/` | Cancel/Delete a booking | Authenticated |

---

## 👥 Group Members

* **Tariq Ali** - ID: 211004633
* **Yousef Ahmed** - ID: 19204031
* **Ziad Esmat** - ID: 211004746

## 🎥 Video Demo

[Watch the Video Demo Here](https://drive.google.com/file/d/19EbeSO0Q0EVA1IhoPTwdx-2OA-mDIlVQ/view?usp=drive_link)



