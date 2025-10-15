# متطلبات: pip install pandas openpyxl
import pandas as pd

# ---- إعدادات المستخدم ----
file_path = r"C:\Users\DELL\Desktop\ai.xlsx"  # غيّر المسار لو لازم
sheet_name = 0   # ممكن تحط اسم الشيت كـ "تكنولوجيا الذكاء الصناعي" أو رقم الشيت (0 للشيت الأول)
column_index = 2  # العمود C => index 2 (0=A, 1=B, 2=C)

# ---- قراءة الإكسيل ----
# engine="openpyxl" مفيد مع ملفات .xlsx
df = pd.read_excel(file_path, sheet_name=sheet_name, engine="openpyxl")

# ---- التأكد إن العمود موجود -->
if column_index >= len(df.columns):
    raise IndexError(f"الملف فيه {len(df.columns)} أعمدة فقط. العمود المطلوب (index {column_index}) مش موجود.")

# استخراج العمود (كمسميات نصية) وتنظيف المسافات الفارغة
col_series = df.iloc[:, column_index].dropna().astype(str).str.strip()

# ترقيم وطباعة
for i, name in enumerate(col_series, start=1):
    print(f"{i}. {name}")

# حفظ في ملف تكست (utf-8)
output_path = "names_list.txt"
with open(output_path, "w", encoding="utf-8") as f:
    for i, name in enumerate(col_series, start=1):
        f.write(f"{i}. {name}\n")

print(f"\nتم حفظ الأسماء المرقمة في الملف: {output_path}")
