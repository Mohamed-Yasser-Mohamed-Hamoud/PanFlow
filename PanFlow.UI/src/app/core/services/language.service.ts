import { Injectable, signal } from '@angular/core';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = signal<Language>(this.getStoredLanguage());

  private translations: Record<Language, Record<string, string>> = {
    ar: {
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.aspects': 'الجوانب',
      'nav.habits': 'العادات',
      'nav.days': 'الأيام',
      'nav.analysis': 'التحليلات',
      'nav.logout': 'تسجيل الخروج',

      // Dashboard
      'dashboard.addTask': 'إضافة مهمة',
      'dashboard.noHabits': 'مفيش عادات مضافة النهارده لسه. دوس "إضافة مهمة" عشان تضيف.',
      'dashboard.unlock': 'فتح هذا اليوم',
      'dashboard.unlocking': 'جاري الإنشاء...',
      'dashboard.deleteDay': 'حذف اليوم',
      'dashboard.restoreDay': 'استعادة اليوم',
      'dashboard.deleteDayConfirm': 'هل تريد حذف هذا اليوم؟ يمكنك استعادته من سلة المحذوفات لمدة 24 ساعة.',
      'dashboard.dayDeleted': 'تم حذف اليوم بنجاح',
      'dashboard.dayRestored': 'تم استعادة اليوم بنجاح',

      // Habits
      'habits.title': 'العادات',
      'habits.create': 'إنشاء عادة',
      'habits.edit': 'تعديل',
      'habits.delete': 'حذف',
      'habits.restore': 'استعادة',
      'habits.noHabits': 'لا توجد عادات',
      'habits.addHabit': 'أضف عادة جديدة',
      'habits.deleteConfirm': 'هل تريد حذف هذه العادة؟',
      'habits.cannotDeleteUsedToday': 'لا يمكن حذف عادة تم إضافتها لليوم الحالي. قم بإزالتها من اليوم أولاً.',

      // Aspects
      'aspects.title': 'الجوانب',
      'aspects.create': 'إنشاء جانب',
      'aspects.edit': 'تعديل',
      'aspects.delete': 'حذف',
      'aspects.noAspects': 'لا توجد جوانب',

      // Auth
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.confirmPassword': 'تأكيد كلمة المرور',
      'auth.username': 'اسم المستخدم',
      'auth.login': 'تسجيل الدخول',
      'auth.register': 'إنشاء حساب',
      'auth.loading': 'جاري التحميل...',
      'auth.loginFailed': 'فشل تسجيل الدخول. حاول مرة أخرى.',
      'auth.registerFailed': 'فشل إنشاء الحساب. حاول مرة أخرى.',
      'auth.fillAllFields': 'يرجى ملء جميع الحقول بشكل صحيح.',
      'auth.haveAccount': 'هل لديك حساب؟',
      'auth.noAccount': 'ليس لديك حساب؟',

      // Profile
      'profile.title': 'الملف الشخصي',
      'profile.account': 'الحساب',
      'profile.username': 'اسم المستخدم',
      'profile.email': 'البريد الإلكتروني',
      'profile.password': 'كلمة المرور',
      'profile.changePassword': 'تغيير كلمة المرور',
      'profile.currentPassword': 'كلمة المرور الحالية',
      'profile.newPassword': 'كلمة المرور الجديدة',
      'profile.confirmNewPassword': 'تأكيد كلمة المرور الجديدة',
      'profile.save': 'حفظ',
      'profile.dangerZone': 'منطقة الخطر',
      'profile.deleteAccount': 'حذف الحساب',
      'profile.deleteAccountConfirm': 'هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
      'profile.language': 'اللغة',
      'profile.arabic': 'العربية',
      'profile.english': 'English',

      // Trash
      'trash.title': 'سلة المحذوفات',
      'trash.habits': 'العادات المحذوفة',
      'trash.aspects': 'الجوانب المحذوفة',
      'trash.days': 'الأيام المحذوفة',
      'trash.empty': 'سلة المحذوفات فارغة',
      'trash.restore': 'استعادة',
      'trash.deleteForever': 'حذف نهائياً',
      'trash.expiresSoon': 'سينتهي خلال',
      'trash.expired': 'انتهت صلاحيته',

      // Analysis
      'analysis.title': 'التحليلات',
      'analysis.bestDay': 'أفضل يوم',
      'analysis.worstDay': 'أسوأ يوم',
      'analysis.bestHabit': 'أفضل عادة',
      'analysis.worstHabit': 'أسوأ عادة',
      'analysis.completionRate': 'معدل الإكمال',
      'analysis.totalDays': 'إجمالي الأيام',
      'analysis.averageCompletion': 'متوسط الإكمال',
      'analysis.habitStats': 'إحصائيات العادات',
      'analysis.dayStats': 'إحصائيات الأيام',
      'analysis.noData': 'لا توجد بيانات للعرض',

      // General
      'general.loading': 'جاري التحميل...',
      'general.error': 'حدث خطأ',
      'general.success': 'تم بنجاح',
      'general.cancel': 'إلغاء',
      'general.confirm': 'تأكيد',
      'general.close': 'إغلاق',
      'general.save': 'حفظ',
      'general.edit': 'تعديل',
      'general.delete': 'حذف',
      'general.add': 'إضافة',
      'general.back': 'رجوع',
    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.aspects': 'Aspects',
      'nav.habits': 'Habits',
      'nav.days': 'Days',
      'nav.analysis': 'Analysis',
      'nav.logout': 'Log Out',

      // Dashboard
      'dashboard.addTask': 'Add Task',
      'dashboard.noHabits': 'No habits added today yet. Click "Add Task" to add one.',
      'dashboard.unlock': 'Unlock this Day',
      'dashboard.unlocking': 'Creating...',
      'dashboard.deleteDay': 'Delete Day',
      'dashboard.restoreDay': 'Restore Day',
      'dashboard.deleteDayConfirm': 'Are you sure you want to delete this day? You can restore it from trash for 24 hours.',
      'dashboard.dayDeleted': 'Day deleted successfully',
      'dashboard.dayRestored': 'Day restored successfully',

      // Habits
      'habits.title': 'Habits',
      'habits.create': 'Create Habit',
      'habits.edit': 'Edit',
      'habits.delete': 'Delete',
      'habits.restore': 'Restore',
      'habits.noHabits': 'No habits',
      'habits.addHabit': 'Add a new habit',
      'habits.deleteConfirm': 'Are you sure you want to delete this habit?',
      'habits.cannotDeleteUsedToday': 'Cannot delete a habit that was added to today. Remove it from today first.',

      // Aspects
      'aspects.title': 'Aspects',
      'aspects.create': 'Create Aspect',
      'aspects.edit': 'Edit',
      'aspects.delete': 'Delete',
      'aspects.noAspects': 'No aspects',

      // Auth
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.username': 'Username',
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.loading': 'Loading...',
      'auth.loginFailed': 'Login failed. Please try again.',
      'auth.registerFailed': 'Registration failed. Please try again.',
      'auth.fillAllFields': 'Please fill all fields correctly.',
      'auth.haveAccount': 'Already have an account?',
      'auth.noAccount': "Don't have an account?",

      // Profile
      'profile.title': 'Profile',
      'profile.account': 'Account',
      'profile.username': 'Username',
      'profile.email': 'Email',
      'profile.password': 'Password',
      'profile.changePassword': 'Change Password',
      'profile.currentPassword': 'Current Password',
      'profile.newPassword': 'New Password',
      'profile.confirmNewPassword': 'Confirm New Password',
      'profile.save': 'Save',
      'profile.dangerZone': 'Danger Zone',
      'profile.deleteAccount': 'Delete Account',
      'profile.deleteAccountConfirm': 'Are you sure you want to delete your account? This action cannot be undone.',
      'profile.language': 'Language',
      'profile.arabic': 'العربية',
      'profile.english': 'English',

      // Trash
      'trash.title': 'Trash',
      'trash.habits': 'Deleted Habits',
      'trash.aspects': 'Deleted Aspects',
      'trash.days': 'Deleted Days',
      'trash.empty': 'Trash is empty',
      'trash.restore': 'Restore',
      'trash.deleteForever': 'Delete Forever',
      'trash.expiresSoon': 'Expires in',
      'trash.expired': 'Expired',

      // Analysis
      'analysis.title': 'Analysis',
      'analysis.bestDay': 'Best Day',
      'analysis.worstDay': 'Worst Day',
      'analysis.bestHabit': 'Best Habit',
      'analysis.worstHabit': 'Worst Habit',
      'analysis.completionRate': 'Completion Rate',
      'analysis.totalDays': 'Total Days',
      'analysis.averageCompletion': 'Average Completion',
      'analysis.habitStats': 'Habit Statistics',
      'analysis.dayStats': 'Day Statistics',
      'analysis.noData': 'No data to display',

      // General
      'general.loading': 'Loading...',
      'general.error': 'Error',
      'general.success': 'Success',
      'general.cancel': 'Cancel',
      'general.confirm': 'Confirm',
      'general.close': 'Close',
      'general.save': 'Save',
      'general.edit': 'Edit',
      'general.delete': 'Delete',
      'general.add': 'Add',
      'general.back': 'Back',
    }
  };

  constructor() {
    this.applyLanguage(this.currentLanguage());
  }

  private getStoredLanguage(): Language {
    const stored = localStorage.getItem('language');
    return (stored === 'ar' || stored === 'en') ? stored : 'en';
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);
    this.applyLanguage(lang);
  }

  private applyLanguage(lang: Language) {
    const htmlElement = document.documentElement;
    htmlElement.lang = lang;
    htmlElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang][key] || key;
  }

  t(key: string): string {
    return this.translate(key);
  }
}
