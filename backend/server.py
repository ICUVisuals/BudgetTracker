from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date
from decimal import Decimal


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="FinTrack API", description="Comprehensive Budget Management API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# =============================================
# MODELS - Define all data structures
# =============================================

# Basic Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Budget Models
class Budget(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    amount: float
    spent: float = 0.0
    category: str
    period: str = "monthly"  # monthly, weekly, yearly
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BudgetCreate(BaseModel):
    name: str
    amount: float
    category: str
    period: str = "monthly"

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    spent: Optional[float] = None
    category: Optional[str] = None
    period: Optional[str] = None

# Card Models
class Card(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    card_type: str  # credit, debit, prepaid
    last_four: str
    expiry: str
    balance: float
    credit_limit: Optional[float] = None
    issuer: str
    color: str = "blue"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CardCreate(BaseModel):
    name: str
    card_type: str
    last_four: str
    expiry: str
    balance: float
    credit_limit: Optional[float] = None
    issuer: str
    color: str = "blue"

class CardUpdate(BaseModel):
    name: Optional[str] = None
    balance: Optional[float] = None
    credit_limit: Optional[float] = None
    color: Optional[str] = None

# Transaction Models
class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    card_id: str
    description: str
    amount: float
    category: str
    transaction_type: str  # purchase, payment
    date: date
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(BaseModel):
    card_id: str
    description: str
    amount: float
    category: str
    transaction_type: str
    date: date
    notes: Optional[str] = None

# Bill Models
class Bill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    amount: float
    due_date: date
    category: str
    auto_pay: bool = False
    status: str = "pending"  # pending, paid, overdue
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BillCreate(BaseModel):
    name: str
    amount: float
    due_date: date
    category: str
    auto_pay: bool = False

# Investment Models
class Investment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    symbol: str
    shares: float
    current_value: float
    purchase_price: float
    asset_type: str  # stocks, bonds, etf, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

class InvestmentCreate(BaseModel):
    name: str
    symbol: str
    shares: float
    current_value: float
    purchase_price: float
    asset_type: str

# Savings Goal Models
class SavingsGoal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: date
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: float
    target_date: date
    current_amount: float = 0.0

# Debt Models
class Debt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    debt_type: str  # credit_card, student_loan, mortgage, auto_loan, etc.
    balance: float
    original_balance: float
    interest_rate: float
    minimum_payment: float
    due_date: date
    lender: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DebtCreate(BaseModel):
    name: str
    debt_type: str
    balance: float
    original_balance: float
    interest_rate: float
    minimum_payment: float
    due_date: date
    lender: str
    notes: Optional[str] = None

# User Profile Models
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    total_balance: float = 0.0
    monthly_income: float = 0.0
    monthly_expenses: float = 0.0
    credit_score: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfileCreate(BaseModel):
    name: str
    email: str
    monthly_income: float = 0.0

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    monthly_income: Optional[float] = None
    credit_score: Optional[int] = None


# =============================================
# API ROUTES - All commented out for localStorage use
# =============================================

# Basic Status Check Routes
@api_router.get("/")
async def root():
    return {"message": "FinTrack API - Budget Management System"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# =============================================
# BUDGET API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/budgets", response_model=List[Budget])
# async def get_budgets():
#     """Get all budgets for the user"""
#     budgets = await db.budgets.find().to_list(1000)
#     return [Budget(**budget) for budget in budgets]

# @api_router.post("/budgets", response_model=Budget)
# async def create_budget(budget: BudgetCreate):
#     """Create a new budget"""
#     budget_dict = budget.dict()
#     budget_obj = Budget(**budget_dict)
#     await db.budgets.insert_one(budget_obj.dict())
#     return budget_obj

# @api_router.put("/budgets/{budget_id}", response_model=Budget)
# async def update_budget(budget_id: str, budget_update: BudgetUpdate):
#     """Update an existing budget"""
#     budget = await db.budgets.find_one({"id": budget_id})
#     if not budget:
#         raise HTTPException(status_code=404, detail="Budget not found")
#     
#     update_data = budget_update.dict(exclude_unset=True)
#     update_data["updated_at"] = datetime.utcnow()
#     
#     await db.budgets.update_one({"id": budget_id}, {"$set": update_data})
#     updated_budget = await db.budgets.find_one({"id": budget_id})
#     return Budget(**updated_budget)

# @api_router.delete("/budgets/{budget_id}")
# async def delete_budget(budget_id: str):
#     """Delete a budget"""
#     result = await db.budgets.delete_one({"id": budget_id})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Budget not found")
#     return {"message": "Budget deleted successfully"}

# @api_router.get("/budgets/overview")
# async def get_budget_overview():
#     """Get budget overview and analytics"""
#     budgets = await db.budgets.find().to_list(1000)
#     total_budget = sum(budget["amount"] for budget in budgets)
#     total_spent = sum(budget["spent"] for budget in budgets)
#     
#     return {
#         "total_budget": total_budget,
#         "total_spent": total_spent,
#         "remaining": total_budget - total_spent,
#         "percentage_used": (total_spent / total_budget * 100) if total_budget > 0 else 0
#     }


# =============================================
# CARD API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/cards", response_model=List[Card])
# async def get_cards():
#     """Get all cards for the user"""
#     cards = await db.cards.find().to_list(1000)
#     return [Card(**card) for card in cards]

# @api_router.post("/cards", response_model=Card)
# async def create_card(card: CardCreate):
#     """Create a new card"""
#     card_dict = card.dict()
#     card_obj = Card(**card_dict)
#     await db.cards.insert_one(card_obj.dict())
#     return card_obj

# @api_router.put("/cards/{card_id}", response_model=Card)
# async def update_card(card_id: str, card_update: CardUpdate):
#     """Update an existing card"""
#     card = await db.cards.find_one({"id": card_id})
#     if not card:
#         raise HTTPException(status_code=404, detail="Card not found")
#     
#     update_data = card_update.dict(exclude_unset=True)
#     await db.cards.update_one({"id": card_id}, {"$set": update_data})
#     updated_card = await db.cards.find_one({"id": card_id})
#     return Card(**updated_card)

# @api_router.delete("/cards/{card_id}")
# async def delete_card(card_id: str):
#     """Delete a card"""
#     result = await db.cards.delete_one({"id": card_id})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Card not found")
#     return {"message": "Card deleted successfully"}


# =============================================
# TRANSACTION API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/transactions", response_model=List[Transaction])
# async def get_transactions(card_id: Optional[str] = None, category: Optional[str] = None):
#     """Get transactions with optional filtering"""
#     filter_dict = {}
#     if card_id:
#         filter_dict["card_id"] = card_id
#     if category:
#         filter_dict["category"] = category
    
#     transactions = await db.transactions.find(filter_dict).to_list(1000)
#     return [Transaction(**transaction) for transaction in transactions]

# @api_router.post("/transactions", response_model=Transaction)
# async def create_transaction(transaction: TransactionCreate):
#     """Create a new transaction"""
#     transaction_dict = transaction.dict()
#     transaction_obj = Transaction(**transaction_dict)
#     await db.transactions.insert_one(transaction_obj.dict())
    
#     # Update card balance
#     card = await db.cards.find_one({"id": transaction.card_id})
#     if card:
#         new_balance = card["balance"]
#         if transaction.transaction_type == "purchase":
#             new_balance += transaction.amount
#         else:  # payment
#             new_balance -= transaction.amount
#         await db.cards.update_one({"id": transaction.card_id}, {"$set": {"balance": new_balance}})
    
#     return transaction_obj

# @api_router.get("/cards/{card_id}/transactions", response_model=List[Transaction])
# async def get_card_transactions(card_id: str):
#     """Get all transactions for a specific card"""
#     transactions = await db.transactions.find({"card_id": card_id}).to_list(1000)
#     return [Transaction(**transaction) for transaction in transactions]


# =============================================
# BILL API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/bills", response_model=List[Bill])
# async def get_bills():
#     """Get all bills"""
#     bills = await db.bills.find().to_list(1000)
#     return [Bill(**bill) for bill in bills]

# @api_router.post("/bills", response_model=Bill)
# async def create_bill(bill: BillCreate):
#     """Create a new bill"""
#     bill_dict = bill.dict()
#     bill_obj = Bill(**bill_dict)
#     await db.bills.insert_one(bill_obj.dict())
#     return bill_obj

# @api_router.get("/bills/upcoming")
# async def get_upcoming_bills():
#     """Get upcoming bills (next 30 days)"""
#     from datetime import timedelta
#     thirty_days_from_now = datetime.now().date() + timedelta(days=30)
#     bills = await db.bills.find({
#         "due_date": {"$lte": thirty_days_from_now},
#         "status": "pending"
#     }).to_list(1000)
#     return [Bill(**bill) for bill in bills]

# @api_router.post("/bills/{bill_id}/pay")
# async def pay_bill(bill_id: str):
#     """Mark a bill as paid"""
#     result = await db.bills.update_one(
#         {"id": bill_id}, 
#         {"$set": {"status": "paid"}}
#     )
#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Bill not found")
#     return {"message": "Bill marked as paid"}


# =============================================
# SAVINGS API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/savings", response_model=List[SavingsGoal])
# async def get_savings_goals():
#     """Get all savings goals"""
#     goals = await db.savings_goals.find().to_list(1000)
#     return [SavingsGoal(**goal) for goal in goals]

# @api_router.post("/savings", response_model=SavingsGoal)
# async def create_savings_goal(goal: SavingsGoalCreate):
#     """Create a new savings goal"""
#     goal_dict = goal.dict()
#     goal_obj = SavingsGoal(**goal_dict)
#     await db.savings_goals.insert_one(goal_obj.dict())
#     return goal_obj


# =============================================
# INVESTMENT API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/investments", response_model=List[Investment])
# async def get_investments():
#     """Get all investments"""
#     investments = await db.investments.find().to_list(1000)
#     return [Investment(**investment) for investment in investments]

# @api_router.post("/investments", response_model=Investment)
# async def create_investment(investment: InvestmentCreate):
#     """Create a new investment"""
#     investment_dict = investment.dict()
#     investment_obj = Investment(**investment_dict)
#     await db.investments.insert_one(investment_obj.dict())
#     return investment_obj


# =============================================
# DEBT API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/debts", response_model=List[Debt])
# async def get_debts():
#     """Get all debts"""
#     debts = await db.debts.find().to_list(1000)
#     return [Debt(**debt) for debt in debts]

# @api_router.post("/debts", response_model=Debt)
# async def create_debt(debt: DebtCreate):
#     """Create a new debt"""
#     debt_dict = debt.dict()
#     debt_obj = Debt(**debt_dict)
#     await db.debts.insert_one(debt_obj.dict())
#     return debt_obj


# =============================================
# USER PROFILE API ROUTES (COMMENTED OUT - USING LOCALSTORAGE)
# =============================================

# @api_router.get("/profile", response_model=UserProfile)
# async def get_user_profile():
#     """Get user profile"""
#     profile = await db.user_profiles.find_one()
#     if not profile:
#         raise HTTPException(status_code=404, detail="Profile not found")
#     return UserProfile(**profile)

# @api_router.post("/profile", response_model=UserProfile)
# async def create_user_profile(profile: UserProfileCreate):
#     """Create user profile"""
#     profile_dict = profile.dict()
#     profile_obj = UserProfile(**profile_dict)
#     await db.user_profiles.insert_one(profile_obj.dict())
#     return profile_obj

# @api_router.put("/profile", response_model=UserProfile)
# async def update_user_profile(profile_update: UserProfileUpdate):
#     """Update user profile"""
#     update_data = profile_update.dict(exclude_unset=True)
#     update_data["updated_at"] = datetime.utcnow()
#     
#     result = await db.user_profiles.update_one({}, {"$set": update_data})
#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Profile not found")
#     
#     updated_profile = await db.user_profiles.find_one()
#     return UserProfile(**updated_profile)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
