from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Count, Q
from django.utils. dateparse import parse_date
import openpyxl
from datetime import datetime

from .models import OpenCourtApplication
from .serializers import (
    UserSerializer, 
    OpenCourtApplicationSerializer,
    ApplicationStatsSerializer,
    CategoryStatsSerializer,
    PoliceStationStatsSerializer
)

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint"""
    try:
        refresh_token = request.data. get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current logged in user"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class OpenCourtApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for Open Court Applications"""
    queryset = OpenCourtApplication.objects.all()
    serializer_class = OpenCourtApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    # Find this section in OpenCourtApplicationViewSet and update: 

def get_queryset(self):
    """Filter applications based on user role"""
    queryset = OpenCourtApplication.objects.all()
    user = self.request.user
    
    # If Staff, show only their station's applications
    if user.role == 'STAFF' and user.police_station:
        queryset = queryset.filter(police_station=user.police_station)
    
    # Filter by status
    status_param = self.request.query_params.get('status')
    if status_param: 
        queryset = queryset.filter(status=status_param)
    
    # Filter by police station
    ps_param = self.request.query_params.get('police_station')
    if ps_param: 
        queryset = queryset.filter(police_station=ps_param)
    
    # Filter by category
    category_param = self. request.query_params.get('category')
    if category_param:
        queryset = queryset.filter(category=category_param)
    
    # Search
    search = self.request.query_params.get('search')
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(dairy_no__icontains=search) |
            Q(contact__icontains=search)
        )
    
    return queryset


    def perform_create(self, serializer):
        """Set created_by to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update application status"""
        application = self. get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['PENDING', 'HEARD', 'REFERRED', 'CLOSED']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application. save()
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_feedback(self, request, pk=None):
        """Update application feedback"""
        application = self. get_object()
        feedback = request.data.get('feedback')
        remarks = request.data.get('remarks', '')
        
        if feedback not in ['POSITIVE', 'NEGATIVE']: 
            return Response(
                {'error': 'Invalid feedback'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.feedback = feedback
        if remarks:
            application.remarks = remarks
        application.save()
        
        serializer = self. get_serializer(application)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_excel(request):
    """Upload and parse Excel file"""
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    excel_file = request.FILES['file']
    
    if not excel_file.name.endswith(('.xlsx', '.xls')):
        return Response(
            {'error': 'File must be Excel format (. xlsx or .xls)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        workbook = openpyxl. load_workbook(excel_file)
        sheet = workbook. active
        
        created_count = 0
        updated_count = 0
        errors = []
        
        # Skip header row
        for row_num, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            try:
                sr_no = row[0]
                
                if not sr_no: 
                    continue
                
                # Parse date
                date_value = row[5]
                if isinstance(date_value, datetime):
                    date_value = date_value.date()
                elif isinstance(date_value, str):
                    date_value = parse_date(date_value)
                
                # Parse days
                days_value = row[12]
                if days_value and str(days_value).isdigit():
                    days_value = int(days_value)
                else:
                    days_value = None
                
                application_data = {
                    'dairy_no': row[1] or '',
                    'name':  row[2] or '',
                    'contact': str(row[3]) if row[3] else '',
                    'marked_to': row[4] or '',
                    'date': date_value,
                    'marked_by': row[6] or '',
                    'timeline': row[7] or '',
                    'police_station': row[8] or '',
                    'division': row[9] or '',
                    'category': row[10] or '',
                    'status': 'PENDING',
                    'days': days_value,
                    'feedback': 'PENDING',
                    'dairy_ps': row[14] if len(row) > 14 else '',
                }
                
                # Check if application exists
                application, created = OpenCourtApplication. objects.update_or_create(
                    sr_no=sr_no,
                    defaults=application_data
                )
                
                if not created:
                    application.created_by = request.user
                    application.save()
                
                if created:
                    created_count += 1
                else:
                    updated_count += 1
                    
            except Exception as e: 
                errors.append(f"Row {row_num}: {str(e)}")
        
        return Response({
            'message': 'Excel file processed successfully',
            'created': created_count,
            'updated': updated_count,
            'errors': errors
        })
        
    except Exception as e:
        return Response(
            {'error': f'Error processing file: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    user = request.user
    
    # Base queryset
    queryset = OpenCourtApplication.objects.all()
    
    # Filter for STAFF role
    if user.role == 'STAFF' and user.police_station:
        queryset = queryset.filter(police_station=user.police_station)
    
    # Overall stats
    stats = {
        'total_applications': queryset.count(),
        'pending':  queryset.filter(status='PENDING').count(),
        'heard': queryset.filter(status='HEARD').count(),
        'referred': queryset.filter(status='REFERRED').count(),
        'closed': queryset.filter(status='CLOSED').count(),
        'positive_feedback': queryset.filter(feedback='POSITIVE').count(),
        'negative_feedback': queryset. filter(feedback='NEGATIVE').count(),
    }
    
    # Category wise stats
    category_stats = list(
        queryset.values('category')
        .annotate(count=Count('id'))
        .order_by('-count')[:10]
    )
    
    # Police Station wise stats (only for ADMIN)
    ps_stats = []
    if user.role == 'ADMIN':
        ps_stats = list(
            OpenCourtApplication.objects.values('police_station')
            .annotate(
                count=Count('id'),
                pending=Count('id', filter=Q(status='PENDING')),
                heard=Count('id', filter=Q(status='HEARD'))
            )
            .order_by('-count')[:10]
        )
    
    # Division wise stats
    division_stats = list(
        queryset.values('division')
        .annotate(count=Count('id'))
        .order_by('-count')
    )
    
    return Response({
        'overall_stats': stats,
        'category_stats': category_stats,
        'police_station_stats': ps_stats,
        'division_stats':  division_stats,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def police_stations(request):
    """Get list of all police stations"""
    stations = OpenCourtApplication.objects. values_list('police_station', flat=True).distinct()
    return Response(list(stations))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def categories(request):
    """Get list of all categories"""
    categories = OpenCourtApplication.objects.values_list('category', flat=True).distinct()
    return Response(list(categories))