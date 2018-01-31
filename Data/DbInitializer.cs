using System;
using System.Collections.Generic;
using System.Linq;
using VipcoMachine.Models;

namespace VipcoMachine.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationContext Context)
        {
            Context.Database.EnsureCreated();

            if (!Context.Users.Any())
            {
                //User
                Context.Users.Add(new User()
                {
                    CreateDate = DateTime.Today,
                    Creator = "Admin",
                    EmpCode = "592381",
                    LevelUser = LevelUser.Administrator,
                    MailAddress = "to.nuttanon@vipco-thai.com",
                    PassWord = "qwer",
                    UserName = "Admin"
                });

                Context.SaveChanges();
            }

            if (Context.Machines.Any())
                return; // DB has been seeded

            if (Context.UnitsMeasures.Any())
            {
                var Template = new List<UnitsMeasure>()
                {
                    new UnitsMeasure{UnitMeasureName="เส้น",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="แผ่น",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="เมตร",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ม้วน",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ลัง",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ต้น",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ถุง",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="กล่อง",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ท่อน",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ตัว",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ก้อน",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="ฟุต",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="อัน",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="กระป๋อง",Creator="Admin",CreateDate=DateTime.Now},
                    new UnitsMeasure{UnitMeasureName="แกลลอน",Creator="Admin",CreateDate=DateTime.Now},
                };

                Template.ForEach(item => Context.UnitsMeasures.Add(item));
                Context.SaveChanges();
            }

            if (Context.ProjectCodeMasters.Count() < 5)
            {
                var Template = new List<ProjectCodeMaster>()
                {
                    new ProjectCodeMaster{ProjectCode="1230",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1713",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1728",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1737",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1739",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1742",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1746",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1748",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1752",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1753",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1757",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1764",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                    new ProjectCodeMaster{ProjectCode="1768",ProjectName="ทดสอบเพิ่มเลขที่ Job",StartDate=DateTime.Now,CreateDate=DateTime.Now,Creator="Admin"},
                };

                Template.ForEach(item => Context.ProjectCodeMasters.Add(item));
                Context.SaveChanges();
            }

            if (!Context.TemplateProjectDetails.Any())
            {
                var Template = new List<TemplateProjectDetail>()
                {
                    new TemplateProjectDetail{TemplateName="Inlet Duct",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Spool Duct",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Outlet Duct",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Outlet Stack",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Platform",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Handrail",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Ladder",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Stair Tower",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Access Door",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Built-up Beam",CreateDate=DateTime.Now,Creator="Admin"},
                    new TemplateProjectDetail{TemplateName="Pipe Rack",CreateDate=DateTime.Now,Creator="Admin"},
                };

                Template.ForEach(item => Context.TemplateProjectDetails.Add(item));
                Context.SaveChanges();
            }



            var CM = Context.TypeMachines.Add(new TypeMachine { TypeMachineCode = "CM", Name = "กลุ่มเครื่องจักรประเภท ตัด Steel Section", Description = "กลุ่มเครื่องจักรประเภท ตัด Steel Section", CreateDate = DateTime.Now, Creator = "Admin" }).Entity;
            var GM = Context.TypeMachines.Add(new TypeMachine { TypeMachineCode = "GM", Name = "กลุ่มเครื่องจักรประเภท ตัด Plate CNC", Description = "กลุ่มเครื่องจักรประเภท ตัด Plate CNC", CreateDate = DateTime.Now, Creator = "Admin" }).Entity;
            var LM = Context.TypeMachines.Add(new TypeMachine { TypeMachineCode = "LM", Name = "กลุ่มเครื่องจักรประเภท กลึง กัด ไส", Description = "กลุ่มเครื่องจักรประเภท กลึง กัด ไส", CreateDate = DateTime.Now, Creator = "Admin" }).Entity;
            var SM = Context.TypeMachines.Add(new TypeMachine { TypeMachineCode = "SM", Name = "กลุ่มเครื่องจักรประเภท บริการเครื่องจักร", Description = "กลุ่มเครื่องจักรประเภท บริการเครื่องจักร", CreateDate = DateTime.Now, Creator = "Admin" }).Entity;

            var Machines = new List<Machine>()
            {
                new Machine{MachineCode="CM-01",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="ST 4060",Remark="H 400 x 350",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="CM-02",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="ST 5070",Remark="H 700 x 400, OD 350",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="CM-03",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="KM 900 M",Remark="H900 x 550",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="CM-04",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="ST 5070",Remark="H700 x 400, OD 350",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="CM-05",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="CARIF 320",Remark="H250 x 175",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="CM-06",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="STG 250G",Remark="OD 250",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="CM-07",MachineName="เครื่องเลื่อยโลหะ/BAND  SAW",MachineStatus=MachineStatus.Ready,TypeMachine = CM,Brand="-",Model="STG 440G",Remark="MAX.610 x 440 mm.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="GM-01",MachineName="เครื่องตัด เจาะโลหะด้วยแก๊ส/CNC  AUTO  GASCUTTING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = GM,Brand="HYPERTERM",Model="MASTER 40S",Remark="CUT MAX 250 MM.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="GM-02",MachineName="เครื่องตัด เจาะโลหะด้วยระบบพลาสม่า/CNC  AUTO  PLASMACUTTING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = GM,Brand="HYPERTERM",Model="HPR 260",Remark="CUT MAX. 32 MM.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="GM-03",MachineName="เครื่องตัด เจาะโลหะด้วยระบบพลาสม่า/CNC  AUTO  PLASMACUTTING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = GM,Brand="HYPERTERM",Model="XD130",Remark="CUT MAX. 25 MM.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="GM-04",MachineName="เครื่องตัด เจาะโลหะด้วยระบบพลาสม่า/CNC  AUTO  PLASMACUTTING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = GM,Brand="HYPERTERM",Model="XD400",Remark="CUT MAX. 50 MM.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="GM-05",MachineName="เครื่องตัด เจาะโลหะด้วยระบบน้ำ/CNC  WATER  JET  PRO  CUTTING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = GM,Brand="FLOW",Model="WJP 4020B",Remark="CUT MAX. 180 MM.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-01",MachineName="เครื่องปาด คว้านหน้าโลหะ/BEVELLING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="130  QFB",Remark="2000 x 3500 x 1700",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-02",MachineName="เครื่องปาด คว้านหน้าโลหะ/BORING  LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="SB 100",Remark="1150 x 110 x 1100",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-03",MachineName="เครื่องปาด คว้านหน้าโลหะ/BORING  PANOMILLER",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="HHVA 15",Remark="1200 x 4000 x 1100",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-04",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/CNC MACHINING CENTER DOUBLE COLUMN",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="YCM",Model="DCV4016B",Remark="TABLE 4X1.6 M",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-05",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/CNC MACHINING CENTER DOUBLE COLUMN",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="HARTFORD",Model="HSA523EAY",Remark="TABLE5X2.3 M",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-06",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/CNC MACHINING CENTER DOUBLE COLUMN",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="YCM",Model="YCM160",Remark="TABLE 1X0.6 M",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-07",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/CNC MACHINING CENTER DOUBLE COLUMN",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="HARTFORD",Model="PRO - 3150S",Remark="TABLE 3X1.5 M",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-08",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="-",Remark="DO 60 x 14t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-09",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="C11MT",Remark="DO 24 x 6t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-10",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="C11MT",Remark="DO 24 x 6t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-11",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="C11MT",Remark="DO 24 x 6t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-12",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="RA 266",Remark="DO 1475 x 4000",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-13",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="MAZAK",Model="SMART250",Remark="CHUCK 10\"",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-14",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="ML 460 - 15",Remark="350 x 1515 mm.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-15",MachineName="เครื่องกลึงโลหะ/LATHE  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="ML 460 - 15",Remark="350 x 1515 mm.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-16",MachineName="เครื่องปาดหน้า,เจาะรูโลหะ/MILL & DRILL  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="ML 460 - 15",Remark="350 x 1515 mm.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-17",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/NC  AUTO  DRILL  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="3BH - 900",Remark="OD 28 x H900",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-18",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/NC  AUTO  DRILL  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="3BA 700D",Remark="OD 28  H700",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-19",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/NC  AUTO  DRILL  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="3DIH 2000 B",Remark="TABLE 4X2 M",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-20",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/RADIAL  DRILL",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="2532 II",Remark="OD 50",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-21",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/RADIAL  DRILL",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="2532 II",Remark="OD 50",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-22",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/RADIAL  DRILL",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="RH - 25",Remark="OD 50",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-23",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/RADIAL  DRILL",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="RE 3 - 1600",Remark="OD 50",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="LM-24",MachineName="เครื่องเจาะรูโลหะด้วยดอกสว่าน/RADIAL  DRILL",MachineStatus=MachineStatus.Ready,TypeMachine = LM,Brand="-",Model="-",Remark="OD 50",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-01",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="16t x 3.0 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-02",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="16t x 2.5 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-03",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="20t x 3.2 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-04",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="19t x 3.2 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-05",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="25t x 3.15 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-06",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="5t x 1.6 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-07",MachineName="เครื่องม้วนโลหะแบบ 3 ลูกกลิ้ง/3 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="JAPAN",Model="MR - 304",Remark="60t x 4 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-08",MachineName="เครื่องม้วนโลหะแบบ 4 ลูกกลิ้ง/4 - ROLLER  PLATE  BENDING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="AKYAPAK",Model="AHS",Remark="35t x 3.1 m.",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-09",MachineName="เครื่องม้วนโละเหล็กฉาก/ANGLE  BENDING",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="L75 x 11",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-10",MachineName="เครื่องตัดโลหะแผ่น/HYDRAULIC  GUILLOTINE  SHEARING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="LVD",Model="PANTER",Remark="3100 x 12.7t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-11",MachineName="เครื่องตัดโลหะแผ่น/HYDRAULIC  GUILLOTINE  SHEARING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="GMV3013",Remark="3050 x 12t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-12",MachineName="เครื่องตัดโลหะแผ่น/HYDRAULIC  GUILLOTINE  SHEARING  MACHINE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="TS3012",Remark="3050 x 12t",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-13",MachineName="เครื่องพับโลหะแบบ 2 ลูกสูบ/HYDRAULIC  PRESS  2 CYD",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="450 Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-14",MachineName="เครื่องพับโลหะแบบ 2 ลูกสูบ/HYDRAULIC  PRESS  2 CYD",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="200  Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-15",MachineName="เครื่องพับโลหะแบบ 2 ลูกสูบ/HYDRAULIC  PRESS  2 CYD",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="JAPAN",Model="HPB 2050",Remark="200 Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-16",MachineName="เครื่องพับโลหะแบบ 2 ลูกสูบ/HYDRAULIC  PRESS  2 CYD",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="GMS",Model="GMS",Remark="200  Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-17",MachineName="เครื่องพับโลหะแบบ 2 ลูกสูบ/HYDRAULIC  PRESS  2 CYD",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="JAPAN",Model="BS 20",Remark="2000  Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-18",MachineName="เครื่องพับโลหะแบบ 4 ลูกสูบ/HYDRAULIC  PRESS  4 CYD",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="200 Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-19",MachineName="เครื่องพับโลหะแบบ 1 ลูกสูบ/HYDRAULIC  PRESS  BRAKE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="400 Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-20",MachineName="เครื่องพับโลหะแบบ 1 ลูกสูบ/HYDRAULIC  PRESS  BRAKE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="-",Model="-",Remark="450 Tons",CreateDate=DateTime.Now,Creator="Admin"},
                new Machine{MachineCode="SM-21",MachineName="เครื่องพับโลหะแบบ 1 ลูกสูบ/HYDRAULIC  PRESS  BRAKE",MachineStatus=MachineStatus.Ready,TypeMachine = SM,Brand="KAWASAKI",Model="SPP - 04",Remark="400 Tons",CreateDate=DateTime.Now,Creator="Admin"},
            };
            Machines.ForEach(item => Context.Machines.Add(item));

            Context.SaveChanges();
        }
    }
}