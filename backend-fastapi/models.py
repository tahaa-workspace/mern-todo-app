from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Task(BaseModel):
    id: Optional[str]=None
    title: Optional[str] = None
    completed: bool=False
    # is_deleted: bool=False
    # updated_at: int = int(datetime.timestamp(datetime.now()))
    # creation: int = int(datetime.timestamp(datetime.now()))