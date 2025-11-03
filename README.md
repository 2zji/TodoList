# python을 활용한 todoList

---

- db: MySQL
- python: 3.10 이상
- CRUD 기능
- 로그인 및 회원가입, 로그아웃

---

- 실행:

  
        .\venv\Scripts\activate 
        uvicorn todo_list.main:app --reload

  
- mySQL id값 초기화:


        ALTER TABLE todo AUTO_INCREMENT = 1;
        ALTER TABLE todo_user AUTO_INCREMENT = 1;

  
- 필수 요구사항:

  
    1. fastapi >= 0.120.0, <1.0

  
    2. uvicorn[standard] >= 0.18

  
    3. sqlalchemy >= 1.4

  
    4. pydantic >= 2.12, <3.0

  
    5. pymysql >= 1.0
