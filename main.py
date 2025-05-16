from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
import os

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vue开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class Robot(BaseModel):
    id: Optional[str] = None
    name: str
    type: str
    application: str
    capability: str
    dataType: str
    power: str
    createTime: Optional[str] = None

class Video(BaseModel):
    id: Optional[str] = None
    name: str
    robotId: str
    type: str
    duration: Optional[str] = None
    url: str
    createTime: Optional[str] = None

class Company(BaseModel):
    id: Optional[str] = None
    name: str
    contact: str
    phone: str
    address: str
    logo: Optional[str] = None
    createTime: Optional[str] = None

class DataType(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    format: str
    unit: str
    createTime: Optional[str] = None

class Settings(BaseModel):
    page1Duration: int
    page2Duration: int
    robotCarouselInterval: int
    page3Duration: int
    videoCarouselInterval: int
    autoPlay: bool
    direction: str
    effect: str

# 模拟数据存储
robots = []
videos = []
companies = []
data_types = []
settings = None

# 机器人相关接口
@app.get("/api/robots")
async def get_robots():
    return robots

@app.post("/api/robots")
async def create_robot(robot: Robot):
    robot.id = str(len(robots) + 1)
    robot.createTime = datetime.now().strftime("%Y/%m/%d")
    robots.append(robot)
    return robot

@app.put("/api/robots/{robot_id}")
async def update_robot(robot_id: str, robot: Robot):
    for i, r in enumerate(robots):
        if r.id == robot_id:
            robot.id = robot_id
            robots[i] = robot
            return robot
    return {"error": "Robot not found"}

@app.delete("/api/robots/{robot_id}")
async def delete_robot(robot_id: str):
    for i, robot in enumerate(robots):
        if robot.id == robot_id:
            del robots[i]
            return {"message": "Robot deleted"}
    return {"error": "Robot not found"}

# 视频相关接口
@app.post("/api/videos/upload")
async def upload_video(file: UploadFile = File(...)):
    # 这里应该实现实际的文件上传逻辑
    file_location = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    return {"url": f"/uploads/{file.filename}"}

# 企业相关接口
@app.post("/api/companies/upload-logo")
async def upload_logo(file: UploadFile = File(...)):
    # 这里应该实现实际的文件上传逻辑
    file_location = f"uploads/logos/{file.filename}"
    os.makedirs("uploads/logos", exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    return {"url": f"/uploads/logos/{file.filename}"}

# 设置相关接口
@app.get("/api/settings")
async def get_settings():
    return settings or {}

@app.put("/api/settings")
async def update_settings(new_settings: Settings):
    global settings
    settings = new_settings
    return settings

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 