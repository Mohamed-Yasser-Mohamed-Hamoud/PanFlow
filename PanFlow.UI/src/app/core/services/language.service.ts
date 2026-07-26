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
      'habits.loading': 'جاري تحميل معلومات العادات...',
      'habits.noHabitsSubtitle': 'أنشئ عادتك الأولى للبدء.',
      'habits.view': 'عرض',
      'habits.createAction': 'إنشاء عادة',
      'habits.habitTitle': 'عادة',
      'habits.aspect': 'الجانب',
      'habits.chooseAspect': 'اختر الجانب',
      'habits.name': 'اسم العادة',
      'habits.modifyEyebrow': 'تعديل',
      'habits.editHabitTitle': 'تعديل العادة',
      'habits.habitName': 'اسم العادة',
      'habits.aspectLabel': 'الجانب',
      'habits.saveChanges': 'حفظ التغييرات',
      'habits.viewEyebrow': 'عرض',
      'habits.habitLabel': 'عادة',
      'habits.habit': 'عادة',

      // Days (Details)
      'days.eyebrow': 'يوم',
      'days.closeDay': 'إغلاق اليوم',
      'days.loading': 'جاري تحميل معلومات اليوم...',
      'days.completed': 'مكتمل',
      'days.noHabits': 'لا توجد عادات لتتبعها حتى الآن. أضف بعض العادات أولاً.',

      // Days List
      'daysList.loading': 'جاري تحميل معلومات الأيام...',
      'daysList.noDaysTitle': 'لا توجد أيام حتى الآن',
      'daysList.noDaysSubtitle': 'ابدأ اليوم لبدء تتبع عاداتك.',
      'daysList.habitsDone': 'عادات تم إنجازها',
      'daysList.delete': 'حذف',
      'daysList.view': 'عرض',
      'daysList.loadingStart': 'جاري التحميل...',
      'daysList.startToday': 'ابدأ اليوم',

      // Aspects
      'aspects.title': 'الجوانب',
      'aspects.create': 'إنشاء جانب',
      'aspects.edit': 'تعديل',
      'aspects.delete': 'حذف',
      'aspects.noAspects': 'لا توجد جوانب',
      'aspects.loading': 'جاري تحميل معلومات الجوانب...',
      'aspects.noAspectsTitle': 'لا توجد جوانب',
      'aspects.noAspectsSubtitle': 'أنشئ جانبك الأول للبدء.',
      'aspects.addAspect': 'إضافة جانب',
      'aspects.deleteAspect': 'حذف الجانب',
      'aspects.editAspect': 'تعديل الجانب',
      'aspects.viewAspect': 'عرض الجانب',
      'aspects.viewEyebrow': 'عرض',
      'aspects.aspectLabel': 'جانب',
      'aspects.closeView': 'إغلاق عرض الجانب',
      'aspects.eyebrow': 'جانب',
      'aspects.habitsTitle': 'العادات',
      'aspects.noHabits': 'لا توجد عادات لهذا الجانب',
      'aspects.cannotLoadHabits': 'لا يمكن تحميل العادات',
      'aspects.sameData': 'هذه هي نفس البيانات',
      'aspects.notUpdated': 'لم يتم التحديث',
      'aspects.updated': 'تم التحديث',
      'aspects.deleted': 'تم الحذف',
      'aspect.create': 'إنشاء جانب',
      'aspect.title': 'الجانب',
      'aspect.name': 'اسم الجانب',
      'aspect.nameRequired': 'اسم الجانب مطلوب*',
      'aspect.color': 'لون الجانب',
      'aspects.modify': 'تعديل',
      'aspects.name': 'اسم الجانب',
      'aspects.color': 'لون الجانب',
      'aspects.saveChanges': 'حفظ التغييرات',

      // Common / General
      'common.create': 'إنشاء',

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

      // Register Component Specific
      'register.userName': 'اسم المستخدم',
      'register.email': 'البريد الإلكتروني',
      'register.password': 'كلمة المرور',
      'register.confirmPassword': 'تأكيد كلمة المرور',
      'register.signUp': 'إنشاء حساب',
      'register.haveAccount': 'لديك حساب بالفعل؟',
      'register.login': 'تسجيل الدخول',
      'register.lamb': 'صورة تعبيرية',
      'register.normal': 'صورة تعبيرية',

      // Login Component Specific
      'login.email': 'البريد الإلكتروني',
      'login.password': 'كلمة المرور',
      'login.login': 'تسجيل الدخول',
      'login.noAccount': 'ليس لديك حساب؟',
      'login.signUp': 'إنشاء حساب',
      'login.lamb': 'صورة تعبيرية',
      'login.normal': 'صورة تعبيرية',

      // Profile
      'profile.title': 'الملف الشخصي',
      'profile.account': 'الحساب',
      'profile.username': 'اسم المستخدم',
      'profile.userName': 'اسم المستخدم',
      'profile.email': 'البريد الإلكتروني',
      'profile.password': 'كلمة المرور',
      'profile.change': 'تغيير',
      'profile.newUserName': 'اسم المستخدم الجديد',
      'profile.newEmail': 'البريد الإلكتروني الجديد',
      'profile.changePassword': 'تغيير كلمة المرور',
      'profile.currentPassword': 'كلمة المرور الحالية',
      'profile.newPassword': 'كلمة المرور الجديدة',
      'profile.confirmNewPassword': 'تأكيد كلمة المرور الجديدة',
      'profile.save': 'حفظ',
      'profile.cancel': 'إلغاء',
      'profile.closeProfile': 'إغلاق الملف الشخصي',
      'profile.samePasswordError': 'لا يمكن أن تكون كلمة المرور الجديدة مطابقة لكلمة المرور الحالية.',
      'profile.dangerZone': 'منطقة الخطر',
      'profile.deleteAccount': 'حذف الحساب',
      'profile.deleteAccountConfirm': 'هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
      'profile.loadingProfile': 'جاري تحميل معلومات الملف الشخصي...',
      'profile.language': 'اللغة',
      'profile.arabic': 'العربية',
      'profile.english': 'English',
      'profile.areYouSure': 'هل أنت متأكد؟',
      'profile.deleted': 'تم الحذف',
      'profile.updated': 'تم التحديث',
      'profile.notUpdated': 'لم يتم التحديث',
      'profile.passwordUpdated': 'تم تحديث كلمة المرور بنجاح!',
      'profile.emailUpdated': 'تم تحديث البريد الإلكتروني بنجاح!',
      'profile.userNameUpdated': 'تم تحديث اسم المستخدم بنجاح!',
      'profile.accountDeletedText': 'تم حذف حسابك.',
      'profile.confirmDelete': 'تأكيد الحذف',
      'profile.enterPassword': 'أدخل كلمة المرور لحذف حسابك.',
      'profile.passwordRequired': 'كلمة المرور مطلوبة',

      // Add Task Modal
      'addTaskModal.title': 'إضافة عادة لليوم',
      'addTaskModal.selectAspect': 'اختر الجانب',
      'addTaskModal.loadingAspects': 'جاري تحميل الجوانب...',
      'addTaskModal.noAspects': 'لا توجد جوانب بعد. أضف جانباً أولاً.',
      'addTaskModal.selectHabits': 'اختر العادات',
      'addTaskModal.loadingHabits': 'جاري تحميل العادات...',
      'addTaskModal.noHabits': 'لا توجد عادات متاحة في هذا الجانب (قد تكون مضافة بالفعل).',
      'addTaskModal.cancel': 'إلغاء',
      'addTaskModal.add': 'إضافة',

      // Trash
      'trash.title': 'سلة المحذوفات',
      'trash.close': 'إغلاق سلة المهملات',
      'trash.habits': 'العادات المحذوفة',
      'trash.aspects': 'الجوانب المحذوفة',
      'trash.days': 'الأيام المحذوفة',
      'trash.empty': 'سلة المحذوفات فارغة',
      'trash.loading': 'جاري التحميل...',
      'trash.restore': 'استعادة',
      'trash.deleteForever': 'حذف نهائياً',
      'trash.expiresSoon': 'سينتهي خلال',
      'trash.expired': 'انتهت صلاحيته',
      'trash.tabs.aspects': 'الجوانب',
      'trash.tabs.habits': 'العادات',
      'trash.tabs.days': 'الأيام',
      'trash.aspects.name': 'اسم الجانب',
      'trash.aspects.color': 'اللون',
      'trash.aspects.actions': 'الإجراءات',
      'trash.habits.name': 'العادة',
      'trash.habits.color': 'اللون',
      'trash.habits.actions': 'الإجراءات',
      'trash.days.date': 'التاريخ',
      'trash.days.actions': 'الإجراءات',
      'trash.actions.restore': 'استعادة',
      'trash.actions.deletePermanently': 'حذف نهائي',

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
      'general.info': 'معلومة',
      'general.ok': 'موافق',
      'general.done': 'تم',
      'general.cancel': 'إلغاء',
      'general.confirm': 'تأكيد',
      'general.close': 'إغلاق',
      'general.save': 'حفظ',
      'general.edit': 'تعديل',
      'general.delete': 'حذف',
      'general.add': 'إضافة',
      'general.back': 'رجوع',
      'validation.passwordMismatch': 'كلمة المرور وتأكيد كلمة المرور غير متطابقين',
      'validation.required': 'هذا الحقل مطلوب',
      'general.deleted': 'تم الحذف'
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
      'habits.loading': 'Loading habits information...',
      'habits.noHabitsSubtitle': 'Create your first habit to get started.',
      'habits.view': 'View',
      'habits.habit': 'Habit',
      'habits.createAction': 'Create Habit',
      'habits.habitTitle': 'Habit',
      'habits.aspect': 'Aspect',
      'habits.chooseAspect': 'Choose Aspect',
      'habits.name': 'Habit Name',
      'habits.modifyEyebrow': 'Modify',
      'habits.editHabitTitle': 'Edit Habit Title',
      'habits.habitName': 'Habit Name',
      'habits.aspectLabel': 'Aspect',
      'habits.saveChanges': 'Save Changes',
      'habits.viewEyebrow': 'View',
      'habits.habitLabel': 'Habit',

      // Days (Details)
      'days.eyebrow': 'day',
      'days.closeDay': 'Close day',
      'days.loading': 'Loading day information...',
      'days.completed': 'completed',
      'days.noHabits': 'No habits to track yet. Add some habits first.',

      // Days List
      'daysList.loading': 'Loading days information...',
      'daysList.noDaysTitle': 'There are no days yet',
      'daysList.noDaysSubtitle': 'Start today to begin tracking your habits.',
      'daysList.habitsDone': 'habits done',
      'daysList.delete': 'Delete',
      'daysList.view': 'View',
      'daysList.loadingStart': 'loading...',
      'daysList.startToday': 'start today',

      // Aspects
      'aspects.title': 'Aspects',
      'aspects.create': 'Create Aspect',
      'aspects.edit': 'Edit',
      'aspects.delete': 'Delete',
      'aspects.noAspects': 'No aspects',
      'aspects.loading': 'Loading aspects information...',
      'aspects.noAspectsTitle': 'There are no aspects',
      'aspects.noAspectsSubtitle': 'Create your first aspect to get started.',
      'aspects.addAspect': 'Add Aspect',
      'aspects.deleteAspect': 'Delete aspect',
      'aspects.editAspect': 'Edit aspect',
      'aspects.viewAspect': 'View aspect',
      'aspects.viewEyebrow': 'View',
      'aspects.aspectLabel': 'aspect',
      'aspects.closeView': 'Close aspect view',
      'aspects.eyebrow': 'aspect',
      'aspects.habitsTitle': 'habits',
      'aspects.noHabits': 'No habits for this aspect',
      'aspects.cannotLoadHabits': 'Cannot load habits',
      'aspects.sameData': 'This is the same data',
      'aspects.notUpdated': 'Not Updated',
      'aspects.updated': 'Updated',
      'aspects.deleted': 'Deleted',
      'aspect.create': 'Create Aspect',
      'aspect.title': 'Aspect',
      'aspect.name': 'Aspect Name',
      'aspect.nameRequired': 'Aspect Name is required*',
      'aspect.color': 'Aspect Color',
      'aspects.modify': 'Modify',
      'aspects.name': 'Aspect Name',
      'aspects.color': 'Aspect Color',
      'aspects.saveChanges': 'Save Changes',

      // Common / General
      'common.create': 'Create',

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

      // Register Component Specific
      'register.userName': 'user name',
      'register.email': 'email',
      'register.password': 'password',
      'register.confirmPassword': 'confirm password',
      'register.signUp': 'sign up',
      'register.haveAccount': 'have an account?',
      'register.login': 'login',
      'register.lamb': 'Lamb',
      'register.normal': 'Normal',

      // Login Component Specific
      'login.email': 'email',
      'login.password': 'password',
      'login.login': 'login',
      'login.noAccount': "don't have an account?",
      'login.signUp': 'sign up',
      'login.lamb': 'Lamb',
      'login.normal': 'Normal',

      // Profile
      'profile.title': 'Profile',
      'profile.account': 'Account',
      'profile.username': 'Username',
      'profile.userName': 'User Name',
      'profile.email': 'Email',
      'profile.password': 'Password',
      'profile.change': 'Change',
      'profile.newUserName': 'New user name',
      'profile.newEmail': 'New email',
      'profile.changePassword': 'Change Password',
      'profile.currentPassword': 'Current Password',
      'profile.newPassword': 'New Password',
      'profile.confirmNewPassword': 'Confirm New Password',
      'profile.save': 'Save',
      'profile.cancel': 'Cancel',
      'profile.closeProfile': 'Close profile',
      'profile.samePasswordError': 'The new password cannot be the same as your current password.',
      'profile.dangerZone': 'Danger Zone',
      'profile.deleteAccount': 'Delete Account',
      'profile.deleteAccountConfirm': 'Are you sure you want to delete your account? This action cannot be undone.',
      'profile.loadingProfile': 'Loading profile information...',
      'profile.language': 'Language',
      'profile.arabic': 'العربية',
      'profile.english': 'English',
      'profile.areYouSure': 'Are you sure?',
      'profile.deleted': 'Deleted',
      'profile.updated': 'Updated',
      'profile.notUpdated': 'Not Updated',
      'profile.passwordUpdated': 'Password Updated Successfully!',
      'profile.emailUpdated': 'Email Updated Successfully!',
      'profile.userNameUpdated': 'User Name Updated Successfully!',
      'profile.accountDeletedText': 'Your account has been deleted.',
      'profile.confirmDelete': 'Confirm Deletion',
      'profile.enterPassword': 'Enter your password to delete your account.',
      'profile.passwordRequired': 'Password is required',

      // Add Task Modal
      'addTaskModal.title': 'Add habit to today',
      'addTaskModal.selectAspect': 'Select aspect',
      'addTaskModal.loadingAspects': 'Loading aspects...',
      'addTaskModal.noAspects': 'No aspects yet. Add an aspect first.',
      'addTaskModal.selectHabits': 'Select habits',
      'addTaskModal.loadingHabits': 'Loading habits...',
      'addTaskModal.noHabits': 'No habits available in this aspect (might already be added).',
      'addTaskModal.cancel': 'Cancel',
      'addTaskModal.add': 'Add',

      // Trash
      'trash.title': 'Trash',
      'trash.close': 'Close trash',
      'trash.habits': 'Deleted Habits',
      'trash.aspects': 'Deleted Aspects',
      'trash.days': 'Deleted Days',
      'trash.empty': 'Trash is empty',
      'trash.loading': 'Loading...',
      'trash.restore': 'Restore',
      'trash.deleteForever': 'Delete Forever',
      'trash.expiresSoon': 'Expires in',
      'trash.expired': 'Expired',
      'trash.tabs.aspects': 'Aspects',
      'trash.tabs.habits': 'Habits',
      'trash.tabs.days': 'Days',
      'trash.aspects.name': 'Aspect Name',
      'trash.aspects.color': 'Color',
      'trash.aspects.actions': 'Actions',
      'trash.habits.name': 'Habit',
      'trash.habits.color': 'Color',
      'trash.habits.actions': 'Actions',
      'trash.days.date': 'Date',
      'trash.days.actions': 'Actions',
      'trash.actions.restore': 'Restore',
      'trash.actions.deletePermanently': 'Delete Permanently',

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
      'general.info': 'Info',
      'general.ok': 'OK',
      'general.done': 'Done',
      'general.cancel': 'Cancel',
      'general.confirm': 'Confirm',
      'general.close': 'Close',
      'general.save': 'Save',
      'general.edit': 'Edit',
      'general.delete': 'Delete',
      'general.add': 'Add',
      'general.back': 'Back',
      'validation.required': 'This field is required',
      'validation.passwordMismatch': 'Passwords do not match',
      'general.deleted': 'Deleted'
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