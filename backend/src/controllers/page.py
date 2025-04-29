from sqlalchemy import update
import models
import schema
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, UploadFile, Depends
from sqlalchemy.orm import Session
from src.utils.helper import AuthHelper
import shutil
from pathlib import Path

UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class PageController(AuthHelper):
    def get_page(self, db: Session = Depends(models.get_db)):
        page = db.query(models.Page).all()
        return {"status": status.HTTP_200_OK, "message": "", "data": page}

    def update_page(self, page: schema.PageSchema, db: Session = Depends(models.get_db)):
        try:
            page_items = {item.page_name: item for item in db.query(models.Page).all()}
            updated_items = []

            for field_name, field_value in page.model_dump().items():
                if field_value:
                    page_name = field_value["page_name"]
                    page_data = field_value["page_data"]

                    if page_name in page_items:
                        page_item = page_items[page_name]
                        page_item.page_data = page_data
                    else:
                        page_item = models.Page(
                            page_name=page_name,
                            page_data=page_data,
                        )
                        db.add(page_item)

                    updated_items.append(page_item)

            db.commit()
            return {
                "status": status.HTTP_200_OK,
                "message": "Successfully updated",
                "data": page_item,
            }

        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()

    def upload_image(self, home: str, image: UploadFile, db: Session = Depends(models.get_db)):
        try:
            page_item = db.query(models.Page).filter(models.Page.page_name == home).first()
            if not page_item:
                raise HTTPException(status_code=404, detail="Page not found")

            file_location = UPLOAD_DIR / image.filename

            with open(file_location, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            page_data = page_item.page_data
            page_data["image"] = str(file_location)

            db.execute(
                update(models.Page)
                .filter(models.Page.page_name == home)
                .values({models.Page.page_data: page_data})
            )

            db.commit()
            return {
                "status": status.HTTP_200_OK,
                "message": "Successfully updated",
                "data": page_item.__dict__,
            }

        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()