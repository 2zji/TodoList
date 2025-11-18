# python을 활용한 todoList

- db: MySQL
- python: 3.10 이상
- react, react-dom: 19.0 이상
- CRUD 기능
- 로그인 및 회원가입, 로그아웃

---

- 실행:
  
        .\venv\Scripts\activate 
        back: uvicorn todo_list.main:app --reload
        front: cd todo_list_ui -> npm run dev
  
- mySQL id값 초기화:

        ALTER TABLE 테이블 명 AUTO_INCREMENT = 1;

  
- 필수 요구사항:

    1. fastapi >= 0.120.0, <1.0

    2. uvicorn[standard] >= 0.18
  
    3. sqlalchemy >= 1.4
  
    4. pydantic >= 2.12, <3.0
  
    5. pymysql >= 1.0