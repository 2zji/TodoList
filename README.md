python을 활용한 todoList

-db: MySQL

-CRUD 기능

-로그인 및 회원가입, 로그아웃

실행: 
    .\venv\Scripts\activate 
    uvicorn todo_list.main:app --reload

mySQL id값 초기화: 
    ALTER TABLE todo AUTO_INCREMENT = 1; 
    ALTER TABLE todo_user AUTO_INCREMENT = 1;

