from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type', 'account', 'category']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date'] # Default ordering

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        # We could add custom date range filtering here later if needed
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = Transaction.objects.filter(user=user)
        
        # Calculate totals
        total_income = transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        balance = total_income - total_expense
        
        # By category (only expenses)
        expenses_by_category = transactions.filter(type='expense').values('category__name', 'category__color').annotate(total=Sum('amount')).order_by('-total')
        
        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance,
            'expenses_by_category': list(expenses_by_category)
        })
