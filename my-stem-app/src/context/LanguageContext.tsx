import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'bg' | 'es';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  label: string;
}

// Дефинираме интерфейс за всички преводи
interface TranslationKeys {
  // Header преводи
  home: string;
  topics: string;
  dashboard: string;
  prolog_chat: string;
  sign_in: string;
  get_started: string;
  logout: string;
  innovation_platform: string;
  
  // Home page преводи
  ideas_acronym: string;
  hero_title_part1: string;
  hero_title_part2: string;
  hero_description: string;
  get_started_free: string;
  view_demos: string;
  schools: string;
  students: string;
  projects: string;
  features_title_part1: string;
  features_title_part2: string;
  features_description: string;
  feature1_title: string;
  feature1_description: string;
  feature2_title: string;
  feature2_description: string;
  feature3_title: string;
  feature3_description: string;
  feature4_title: string;
  feature4_description: string;
  feature5_title: string;
  feature5_description: string;
  feature6_title: string;
  feature6_description: string;
  explore_tools: string;
  start_collaborating: string;
  view_projects: string;
  see_analytics: string;
  browse_curriculum: string;
  learn_skills: string;
  demo_title_part1: string;
  demo_title_part2: string;
  demo_description: string;
  demo_feature1_title: string;
  demo_feature1_description: string;
  demo_feature2_title: string;
  demo_feature2_description: string;
  demo_feature3_title: string;
  demo_feature3_description: string;
  demo_feature4_title: string;
  demo_feature4_description: string;
  explore_live_demos: string;
  try_free_tutorial: string;
  
  // Footer преводи
  footer_description: string;
  footer_platform: string;
  footer_support: string;
  help_center: string;
  contact_us: string;
  privacy_policy: string;
  terms_of_service: string;
  documentation: string;
  submissions: string;
  all_rights_reserved: string;
  privacy: string;
  terms: string;
  cookies: string;
  
  // Dashboard преводи (основни)
  welcome_back: string;
  upload_code: string;
  upload_file: string;
  quick_stats: string;
  total_submissions: string;
  success_rate: string;
  upload_prolog_code: string;
  upload_prolog_file: string;
  my_submissions: string;
  active: string;
  no_data: string;
  successful: string;
  success_rate_small: string;
  file_uploads: string;
  folders: string;
  prolog_code_editor: string;
  save_draft: string;
  clear: string;
  write_prolog_code: string;
  example: string;
  upload_code_button: string;
  clear_editor: string;
  upload_success: string;
  no_file_user: string;
  only_pl_files: string;
  upload_failed: string;
  file_upload_success: string;
  unexpected_error: string;
  status_success: string;
  status_error: string;
  status_pending: string;
  select_folder: string;
  drag_drop_file: string;
  or_click_browse: string;
  upload_to_folder: string;
  clear_selection: string;
  only_pl_files_info: string;
  files_saved_in: string;
  recent_submissions: string;
  all: string;
  success_filter: string;
  files_filter: string;
  no_submissions: string;
  start_uploading: string;
  upload_first_code: string;
  no_code_preview: string;
  view_details: string;
  run_again: string;
  
  // Нови dashboard преводи от кода
  welcome_subtitle: string;
  search_placeholder: string;
  learning_platform: string;
  my_courses: string;
  assignments: string;
  progress: string;
  settings: string;
  learning_progress: string;
  week: string;
  month: string;
  year: string;
  all_time: string;
  completion_rate: string;
  total_study_hours: string;
  completed_tasks: string;
  streak_days: string;
  progress_over_time: string;
  skill_distribution: string;
  recent_activity: string;
  completed_assignment: string;
  uploaded_file: string;
  achieved_milestone: string;
  browse_files: string;
  or: string;
  upload_to: string;
  make_first_submission: string;
  all_assignments: string;
  in_progress: string;
  completed: string;
  pending: string;
  due: string;
  tasks: string;
  details: string;
  continue_learning: string;
  complete: string;
  weekly_progress: string;
  weekly_completion: string;
  learning_hours: string;
  daily_study_hours: string;
  my_assignments: string;
  view_all: string;
  
  // Login page преводи
  login_description: string;
  access_projects: string;
  track_progress: string;
  collaborate_peers: string;
  sign_in_account: string;
  enter_credentials: string;
  email_address: string;
  enter_email: string;
  password: string;
  enter_password: string;
  remember_me: string;
  forgot_password: string;
  signing_in: string;
  sign_in_ideas: string;
  new_to_ideas: string;
  create_account: string;
  terms_agreement: string;
  and: string;
  
  // Register page преводи
  register_title: string;
  register_journey_title: string;
  register_platform_description: string;
  join_platform: string;
  interactive_tutorials: string;
  hands_on_projects: string;
  collaborative_learning: string;
  progress_tracking: string;
  create_your_account: string;
  start_stem_journey: string;
  confirm_password: string;
  confirm_password_placeholder: string;
  password_placeholder: string;
  i_agree_to: string;
  send_me_updates: string;
  creating_account: string;
  create_ideas_account: string;
  already_have_account: string;
  sign_in_existing: string;
  register_footer_text: string;
  
  // Validation messages преводи
  password_mismatch: string;
  password_too_short: string;
  password_weak: string;
  email_in_use: string;
  invalid_email: string;
  
  // Register success message
  registration_successful: string;
  
  // Theme toggle преводи
  switch_to_light: string;
  switch_to_dark: string;
  
  // Нови преводи за липсващите ключове
  what_to_learn: string;
  explore_courses: string;
  
  // Нови преводи за PrologChat
  prolog_assistant: string;
  domain_based_knowledge: string;
  chat_stats: string;
  active_domain: string;
  domain: string;
  no_active_domain: string;
  knowledge_domains: string;
  clear_domain: string;
  clear_chat: string;
  chat: string;
  code_preview: string;
  system_commands: string;
  file_management: string;
  enter_filename: string;
  file_command_hint: string;
  responses: string;
  expand_chat: string;
  collapse_chat: string;
  loading_domain: string;
  domain_loaded_success: string;
  domain_load_error: string;
  thinking: string;
  no_server_response: string;
  connection_error: string;
  select_domain_first: string;
  enter_prolog_query: string;
  press_enter_to_send: string;
  queries_end_with_period: string;
  connected_to: string;
  send: string;
  no_domain_selected: string;
  select_domain_to_view: string;
  no_code_files_for: string;
  upload_code_for_domain: string;
  files: string;
  no_domain: string;
  copy_code: string;
  view_full_code: string;
  api_server: string;
  queries: string;
  code_files: string;
  none: string;
  status: string;
  animals: string;
  history: string;
  geography: string;
  mineral_water: string;
  animal_facts_description: string;
  historical_facts_description: string;
  geographical_facts_description: string;
  mineral_water_description: string;
  help: string;
  load_all: string;
  list_files: string;
  clear_facts: string;
  current_file: string;
  list_predicates: string;
  unload_all: string;
  consult_file: string;
  reconsult_file: string;
  unload_file: string;
  switch_file: string;
  example_queries: string;
  
  // Tooltips
  help_tooltip: string;
  load_all_tooltip: string;
  list_files_tooltip: string;
  clear_facts_tooltip: string;
  current_file_tooltip: string;
  list_predicates_tooltip: string;
  unload_all_tooltip: string;
  consult_file_tooltip: string;
  reconsult_file_tooltip: string;
  unload_file_tooltip: string;
  switch_file_tooltip: string;
  
  // Балкан преводи
  balkan: string;
  balkan_description: string;
  central_balkan: string;
}

// Тип за обекта с всички преводи
type Translations = {
  [key in Language]: TranslationKeys;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageOptions: LanguageOption[];
  currentLanguage: LanguageOption;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Преводите с правилната типизация
const translations: Translations = {
  en: {
    // Header преводи
    home: 'Home',
    topics: 'Topics',
    dashboard: 'Dashboard',
    prolog_chat: 'Prolog Chat',
    sign_in: 'Sign in',
    get_started: 'Get Started',
    logout: 'Logout',
    innovation_platform: 'Innovation Platform',
    
    // Home page преводи
    ideas_acronym: 'Intelligent Data Educational Analysis System',
    hero_title_part1: 'Transform STEM Education',
    hero_title_part2: 'with AI-Powered Learning',
    hero_description: 'Empower students with logical programming and artificial intelligence concepts through interactive, hands-on STEM projects.',
    get_started_free: 'Get Started Free',
    view_demos: 'View Demos',
    schools: 'Schools',
    students: 'Students',
    projects: 'Projects',
    features_title_part1: 'Everything you need to teach',
    features_title_part2: 'AI and Logic Programming',
    features_description: 'Comprehensive tools and resources designed specifically for STEM education',
    feature1_title: 'AI-Powered Learning',
    feature1_description: 'Interactive tutorials and intelligent feedback systems that adapt to each student\'s learning pace.',
    feature2_title: 'Real-time Collaboration',
    feature2_description: 'Students work together on projects with live editing and instant feedback.',
    feature3_title: 'Hands-on Projects',
    feature3_description: 'Practical STEM projects that apply logical programming to real-world problems.',
    feature4_title: 'Progress Analytics',
    feature4_description: 'Detailed insights into student performance and learning patterns.',
    feature5_title: 'Curriculum Integration',
    feature5_description: 'Seamlessly fits into existing STEM curricula with ready-to-use lesson plans.',
    feature6_title: 'Industry Ready Skills',
    feature6_description: 'Prepares students for careers in AI, data science, and technology.',
    explore_tools: 'Explore AI Tools',
    start_collaborating: 'Start Collaborating',
    view_projects: 'View Projects',
    see_analytics: 'See Analytics',
    browse_curriculum: 'Browse Curriculum',
    learn_skills: 'Learn Skills',
    demo_title_part1: 'See IDEAS',
    demo_title_part2: 'in Action',
    demo_description: 'Experience how our platform transforms complex programming concepts into engaging, interactive learning experiences that students love.',
    demo_feature1_title: 'Visual Programming Interface',
    demo_feature1_description: 'Drag-and-drop logic blocks for intuitive learning',
    demo_feature2_title: 'Real-time Code Execution',
    demo_feature2_description: 'See results instantly as you write Prolog code',
    demo_feature3_title: 'Interactive Tutorials',
    demo_feature3_description: 'Step-by-step guided learning experiences',
    demo_feature4_title: 'Collaborative Workspace',
    demo_feature4_description: 'Work together with classmates in real-time',
    explore_live_demos: 'Explore Live Demos',
    try_free_tutorial: 'Try Free Tutorial',
    
    // Footer преводи
    footer_description: 'Empowering the next generation of innovators through logical programming and AI education. Transforming STEM learning worldwide.',
    footer_platform: 'Platform',
    footer_support: 'Support',
    help_center: 'Help Center',
    contact_us: 'Contact Us',
    privacy_policy: 'Privacy Policy',
    terms_of_service: 'Terms of Service',
    documentation: 'Documentation',
    submissions: 'Submissions',
    all_rights_reserved: 'All rights reserved.',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    
    // Dashboard преводи (основни)
    welcome_back: 'Welcome back!',
    upload_code: 'Upload Code',
    upload_file: 'Upload File',
    quick_stats: 'Quick Stats',
    total_submissions: 'Total Submissions',
    success_rate: 'Success Rate',
    upload_prolog_code: 'Upload Prolog Code',
    upload_prolog_file: 'Upload Prolog File',
    my_submissions: 'My Submissions',
    active: 'Active',
    no_data: 'No data',
    successful: 'Successful',
    success_rate_small: 'success rate',
    file_uploads: 'File Uploads',
    folders: 'folders',
    prolog_code_editor: 'Prolog Code Editor',
    save_draft: 'Save Draft',
    clear: 'Clear',
    write_prolog_code: 'Write your Prolog code here...',
    example: 'Example',
    upload_code_button: 'Upload Code',
    clear_editor: 'Clear Editor',
    upload_success: 'Code uploaded successfully!',
    no_file_user: 'No file selected or user not logged in',
    only_pl_files: 'Only .pl files allowed',
    upload_failed: 'Upload failed:',
    file_upload_success: 'File uploaded successfully!',
    unexpected_error: 'An unexpected error occurred',
    status_success: 'Success',
    status_error: 'Error',
    status_pending: 'Pending',
    select_folder: 'Select Destination Folder:',
    drag_drop_file: 'Drag & drop your .pl file here',
    or_click_browse: 'or click to browse',
    upload_to_folder: 'Upload to',
    clear_selection: 'Clear Selection',
    only_pl_files_info: 'Only .pl files are allowed',
    files_saved_in: 'Files will be saved in:',
    recent_submissions: 'Recent Submissions',
    all: 'All',
    success_filter: 'Success',
    files_filter: 'Files',
    no_submissions: 'No submissions yet',
    start_uploading: 'Start by uploading your first Prolog code or file!',
    upload_first_code: 'Upload First Code',
    no_code_preview: 'No code preview available...',
    view_details: 'View Details',
    run_again: 'Run Again',
    
    // Нови dashboard преводи
    welcome_subtitle: 'Here\'s your learning progress and upcoming activities',
    search_placeholder: 'Search courses, lessons...',
    learning_platform: 'Learning Platform',
    my_courses: 'My Courses',
    assignments: 'Assignments',
    progress: 'Progress',
    settings: 'Settings',
    learning_progress: 'Learning Progress',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    all_time: 'All Time',
    completion_rate: 'Completion Rate',
    total_study_hours: 'Total Study Hours',
    completed_tasks: 'Completed Tasks',
    streak_days: 'Streak Days',
    progress_over_time: 'Progress Over Time',
    skill_distribution: 'Skill Distribution',
    recent_activity: 'Recent Activity',
    completed_assignment: 'Completed assignment',
    uploaded_file: 'Uploaded file',
    achieved_milestone: 'Achieved milestone',
    browse_files: 'Browse Files',
    or: 'or',
    upload_to: 'Upload to',
    make_first_submission: 'Make your first submission',
    all_assignments: 'All Assignments',
    in_progress: 'In Progress',
    completed: 'Completed',
    pending: 'Pending',
    due: 'Due',
    tasks: 'tasks',
    details: 'Details',
    continue_learning: 'Continue Learning',
    complete: 'Complete',
    weekly_progress: 'Weekly Progress',
    weekly_completion: 'Weekly completion rate',
    learning_hours: 'Learning Hours',
    daily_study_hours: 'Daily study hours this week',
    my_assignments: 'My Assignments',
    view_all: 'View All',
    
    // Login page преводи
    login_description: "Continue your journey in AI-powered STEM education and explore interactive programming concepts.",
    access_projects: "Access your projects",
    track_progress: "Track your progress",
    collaborate_peers: "Collaborate with peers",
    sign_in_account: "Sign In to Your Account",
    enter_credentials: "Enter your credentials to continue learning",
    email_address: "Email Address",
    enter_email: "Enter your email",
    password: "Password",
    enter_password: "Enter your password",
    remember_me: "Remember me",
    forgot_password: "Forgot password?",
    signing_in: "Signing In...",
    sign_in_ideas: "Sign In to IDEAS",
    new_to_ideas: "New to IDEAS?",
    create_account: "Create an Account",
    terms_agreement: "By continuing, you agree to our",
    and: "and",
    
    // Register page преводи
    register_title: "Join the IDEAS Community",
    register_journey_title: "Start your STEM learning journey today",
    register_platform_description: "Start your journey in AI-powered STEM education and discover the world of logical programming and artificial intelligence.",
    join_platform: "Join the",
    interactive_tutorials: "Interactive tutorials",
    hands_on_projects: "Hands-on projects",
    collaborative_learning: "Collaborative learning",
    progress_tracking: "Progress tracking",
    create_your_account: "Create Your Account",
    start_stem_journey: "Start your STEM learning journey today",
    confirm_password: "Confirm Password",
    confirm_password_placeholder: "Confirm your password",
    password_placeholder: "Create a password (min. 6 characters)",
    i_agree_to: "I agree to the",
    send_me_updates: "Send me educational resources and updates",
    creating_account: "Creating Account...",
    create_ideas_account: "Create IDEAS Account",
    already_have_account: "Already have an account?",
    sign_in_existing: "Sign In to Existing Account",
    register_footer_text: "By creating an account, you agree to our platform policies and educational guidelines.",
    
    // Validation messages преводи
    password_mismatch: "Passwords don't match",
    password_too_short: "Password should be at least 6 characters",
    password_weak: "Password is too weak",
    email_in_use: "Email already in use",
    invalid_email: "Invalid email address",
    
    // Register success message
    registration_successful: "Registration successful! Welcome to IDEAS.",
    
    // Theme toggle преводи
    switch_to_light: "Switch to light theme",
    switch_to_dark: "Switch to dark theme",
    
    // Нови преводи за липсващите ключове
    what_to_learn: "What to Learn",
    explore_courses: "Explore Courses",
    
    // Нови преводи за PrologChat
    prolog_assistant: 'Prolog AI Assistant',
    domain_based_knowledge: 'Domain-Based Knowledge',
    chat_stats: 'Chat Stats',
    active_domain: 'Active Domain',
    domain: 'Domain',
    no_active_domain: 'No Active Domain',
    knowledge_domains: 'Knowledge Domains',
    clear_domain: 'Clear domain',
    clear_chat: 'Clear Chat',
    chat: 'Chat',
    code_preview: 'Code Preview',
    system_commands: 'System Commands',
    file_management: 'File Management',
    enter_filename: 'Enter filename (e.g., animals.pl)',
    file_command_hint: 'Enter filename above, then click a file command',
    responses: 'responses',
    expand_chat: 'Expand chat',
    collapse_chat: 'Collapse chat',
    loading_domain: 'Loading domain',
    domain_loaded_success: 'Domain loaded successfully. Ready for queries.',
    domain_load_error: 'Error loading domain',
    thinking: 'Thinking',
    no_server_response: 'No response from server',
    connection_error: 'Connection error',
    select_domain_first: 'Select a domain first',
    enter_prolog_query: 'Enter Prolog query for',
    press_enter_to_send: 'Press Enter to send',
    queries_end_with_period: 'Make sure queries end with a period (.)',
    connected_to: 'Connected to',
    send: 'Send',
    no_domain_selected: 'No Domain Selected',
    select_domain_to_view: 'Select a domain from the sidebar to view its code files.',
    no_code_files_for: 'No code files for',
    upload_code_for_domain: 'Upload code files for this domain to see them here.',
    files: 'files',
    no_domain: 'No domain',
    copy_code: 'Copy code',
    view_full_code: 'View Full Code',
    api_server: 'API',
    queries: 'Queries',
    code_files: 'Code Files',
    none: 'None',
    status: 'Status',
    animals: 'Animals',
    history: 'History',
    geography: 'Geography',
    mineral_water: 'Mineral Water',
    animal_facts_description: 'Animal facts and relationships',
    historical_facts_description: 'Historical events and figures',
    geographical_facts_description: 'Geographical facts and locations',
    mineral_water_description: 'Mineral water sources and properties',
    help: 'Help',
    load_all: 'Load All',
    list_files: 'List Files',
    clear_facts: 'Clear Facts',
    current_file: 'Current File',
    list_predicates: 'List Predicates',
    unload_all: 'Unload All',
    consult_file: 'Consult File',
    reconsult_file: 'Reconsult File',
    unload_file: 'Unload File',
    switch_file: 'Switch File',
    example_queries: '📚 Example Queries:\n\n',
    
    // Tooltips
    help_tooltip: 'Show help information',
    load_all_tooltip: 'Load all Prolog files',
    list_files_tooltip: 'List all loaded files',
    clear_facts_tooltip: 'Clear all loaded facts',
    current_file_tooltip: 'Show current active file',
    list_predicates_tooltip: 'List all available predicates',
    unload_all_tooltip: 'Unload all Prolog files',
    consult_file_tooltip: 'Load a Prolog file',
    reconsult_file_tooltip: 'Reload a Prolog file',
    unload_file_tooltip: 'Unload a Prolog file',
    switch_file_tooltip: 'Switch to another file',
    
    // Балкан преводи
    balkan: 'Balkan',
    balkan_description: 'Balkan sources and properties',
    central_balkan: 'Central Balkan',
  },
  bg: {
    // Header преводи
    home: 'Начало',
    topics: 'Теми',
    dashboard: 'Табло',
    prolog_chat: 'Prolog Чат',
    sign_in: 'Вход',
    get_started: 'Започнете',
    logout: 'Изход',
    innovation_platform: 'Иновационна платформа',
    
    // Home page преводи
    ideas_acronym: 'Интелигентна система за анализ на образователни данни',
    hero_title_part1: 'Трансформирайте STEM образованието',
    hero_title_part2: 'с изкуствен интелект',
    hero_description: 'Дайте възможност на учениците да изучават логическо програмиране и концепции на изкуствения интелект чрез интерактивни, практически STEM проекти.',
    get_started_free: 'Започнете безплатно',
    view_demos: 'Вижте демонстрации',
    schools: 'Училища',
    students: 'Ученици',
    projects: 'Проекти',
    features_title_part1: 'Всичко необходимо за обучение',
    features_title_part2: 'по AI и логическо програмиране',
    features_description: 'Цялостни инструменти и ресурси, създадени специално за STEM образованието',
    feature1_title: 'Обучение с AI',
    feature1_description: 'Интерактивни уроци и интелигентни системи за обратна връзка, които се адаптират към темпото на всеки ученик.',
    feature2_title: 'Съвместна работа в реално време',
    feature2_description: 'Учениците работят заедно по проекти с възможност за редакции в реално време и незабавна обратна връзка.',
    feature3_title: 'Практически проекти',
    feature3_description: 'Практически STEM проекти, които прилагат логическо програмиране в реални проблеми.',
    feature4_title: 'Анализ на напредъка',
    feature4_description: 'Подробни анализи на представянето и моделите на учене на учениците.',
    feature5_title: 'Интеграция в учебния план',
    feature5_description: 'Безпроблемно се вписва в съществуващите STEM учебни програми с готови за използване планове за уроци.',
    feature6_title: 'Навыци за индустрията',
    feature6_description: 'Подготвя учениците за кариери в AI, науката за данните и технологиите.',
    explore_tools: 'Разгледайте AI инструментите',
    start_collaborating: 'Започнете съвместна работа',
    view_projects: 'Вижте проектите',
    see_analytics: 'Вижте анализите',
    browse_curriculum: 'Разгледайте учебната програма',
    learn_skills: 'Научете умения',
    demo_title_part1: 'Вижте IDEAS',
    demo_title_part2: 'в действие',
    demo_description: 'Изживейте как нашата платформа трансформира сложните програмни концепции в ангажиращи, интерактивни учебни преживявания, които учениците обичат.',
    demo_feature1_title: 'Визуален интерфейс за програмиране',
    demo_feature1_description: 'Плъзгане и пускане на логически блокове за интуитивно учене',
    demo_feature2_title: 'Изпълнение на код в реално време',
    demo_feature2_description: 'Вижте резултатите моментално, докато пишете Prolog код',
    demo_feature3_title: 'Интерактивни уроци',
    demo_feature3_description: 'Уроци с ръководство стъпка по стъпка',
    demo_feature4_title: 'Съвместно работно пространство',
    demo_feature4_description: 'Работете заедно със съученици в реално време',
    explore_live_demos: 'Разгледайте живи демонстрации',
    try_free_tutorial: 'Опитайте безплатен урок',
    
    // Footer преводи
    footer_description: 'Даваме възможност на следващото поколение иноватори чрез логическо програмиране и AI образование. Трансформираме STEM образованието по целия свят.',
    footer_platform: 'Платформа',
    footer_support: 'Поддръжка',
    help_center: 'Център за помощ',
    contact_us: 'Свържете се с нас',
    privacy_policy: 'Политика за поверителност',
    terms_of_service: 'Условия за ползване',
    documentation: 'Документация',
    submissions: 'Подадени материали',
    all_rights_reserved: 'Всички права запазени.',
    privacy: 'Поверителност',
    terms: 'Условия',
    cookies: 'Бисквитки',
    
    // Dashboard преводи (основни)
    welcome_back: 'Добре дошли отново!',
    upload_code: 'Качване на код',
    upload_file: 'Качване на файл',
    quick_stats: 'Бърза статистика',
    total_submissions: 'Общо подадени',
    success_rate: 'Процент на успех',
    upload_prolog_code: 'Качване на Prolog код',
    upload_prolog_file: 'Качване на Prolog файл',
    my_submissions: 'Моите подадени материали',
    active: 'Активно',
    no_data: 'Няма данни',
    successful: 'Успешни',
    success_rate_small: 'процент успех',
    file_uploads: 'Качени файлове',
    folders: 'папки',
    prolog_code_editor: 'Prolog код редактор',
    save_draft: 'Запази чернова',
    clear: 'Изчисти',
    write_prolog_code: 'Напишете Prolog код тук...',
    example: 'Пример',
    upload_code_button: 'Качи код',
    clear_editor: 'Изчисти редактор',
    upload_success: 'Кодът е качен успешно!',
    no_file_user: 'Няма избран файл или потребител не е влязъл',
    only_pl_files: 'Позволени са само .pl файлове',
    upload_failed: 'Неуспешно качване:',
    file_upload_success: 'Файлът е качен успешно!',
    unexpected_error: 'Възникна неочаквана грешка',
    status_success: 'Успех',
    status_error: 'Грешка',
    status_pending: 'Чакащо',
    select_folder: 'Изберете целева папка:',
    drag_drop_file: 'Плъзнете и пуснете .pl файл тук',
    or_click_browse: 'или кликнете за да изберете',
    upload_to_folder: 'Качи в',
    clear_selection: 'Изчисти избора',
    only_pl_files_info: 'Позволени са само .pl файлове',
    files_saved_in: 'Файловете ще бъдат запазени в:',
    recent_submissions: 'Последни подадени материали',
    all: 'Всички',
    success_filter: 'Успешни',
    files_filter: 'Файлове',
    no_submissions: 'Все още няма подадени материали',
    start_uploading: 'Започнете с качване на първия Prolog код или файл!',
    upload_first_code: 'Качи първи код',
    no_code_preview: 'Няма наличен преглед на кода...',
    view_details: 'Виж детайли',
    run_again: 'Пусни отново',
    
    // Нови dashboard преводи
    welcome_subtitle: 'Ето вашия напредък в ученето и предстоящите дейности',
    search_placeholder: 'Търсене на курсове, уроци...',
    learning_platform: 'Образователна платформа',
    my_courses: 'Моите курсове',
    assignments: 'Задания',
    progress: 'Напредък',
    settings: 'Настройки',
    learning_progress: 'Напредък в обучението',
    week: 'Седмица',
    month: 'Месец',
    year: 'Година',
    all_time: 'Всичко',
    completion_rate: 'Процент на завършване',
    total_study_hours: 'Общо учебни часове',
    completed_tasks: 'Завършени задачи',
    streak_days: 'Дни в ред',
    progress_over_time: 'Напредък във времето',
    skill_distribution: 'Разпределение на уменията',
    recent_activity: 'Последна активност',
    completed_assignment: 'Завършено задание',
    uploaded_file: 'Качен файл',
    achieved_milestone: 'Постигнат етап',
    browse_files: 'Изберете файлове',
    or: 'или',
    upload_to: 'Качи в',
    make_first_submission: 'Направете първото си подаване',
    all_assignments: 'Всички задания',
    in_progress: 'В процес',
    completed: 'Завършено',
    pending: 'Чакащо',
    due: 'Срок',
    tasks: 'задачи',
    details: 'Детайли',
    continue_learning: 'Продължи обучението',
    complete: 'Завършено',
    weekly_progress: 'Седмичен напредък',
    weekly_completion: 'Процент на завършване за седмицата',
    learning_hours: 'Учебни часове',
    daily_study_hours: 'Ежедневни учебни часове тази седмица',
    my_assignments: 'Моите задания',
    view_all: 'Виж всички',
    
    // Login page преводи
    login_description: "Продължете пътешествието си в STEM образованието с изкуствен интелект и разгледайте интерактивни програмни концепции.",
    access_projects: "Достъп до вашите проекти",
    track_progress: "Проследявайте напредъка си",
    collaborate_peers: "Сътрудничество със съученици",
    sign_in_account: "Вход във вашия акаунт",
    enter_credentials: "Въведете вашите данни, за да продължите ученето",
    email_address: "Имейл адрес",
    enter_email: "Въведете имейл",
    password: "Парола",
    enter_password: "Въведете парола",
    remember_me: "Запомни ме",
    forgot_password: "Забравена парола?",
    signing_in: "Влизане...",
    sign_in_ideas: "Вход в IDEAS",
    new_to_ideas: "Нов в IDEAS?",
    create_account: "Създай акаунт",
    terms_agreement: "Продължавайки, вие се съгласявате с нашите",
    and: "и",
    
    // Register page преводи
    register_title: "Присъединете се към IDEAS общността",
    register_journey_title: "Започнете пътешествието си в STEM ученето днес",
    register_platform_description: "Започнете пътешествието си в STEM образованието с изкуствен интелект и разгледайте света на логическото програмиране и изкуствения интелект.",
    join_platform: "Присъединете се към",
    interactive_tutorials: "Интерактивни уроци",
    hands_on_projects: "Практически проекти",
    collaborative_learning: "Съвместно учене",
    progress_tracking: "Проследяване на напредъка",
    create_your_account: "Създайте своя акаунт",
    start_stem_journey: "Започнете пътешествието си в STEM ученето днес",
    confirm_password: "Потвърдете паролата",
    confirm_password_placeholder: "Потвърдете паролата си",
    password_placeholder: "Създайте парола (мин. 6 символа)",
    i_agree_to: "Съгласявам се с",
    send_me_updates: "Изпращайте ми образователни ресурси и актуализации",
    creating_account: "Създаване на акаунт...",
    create_ideas_account: "Създай акаунт в IDEAS",
    already_have_account: "Вече имате акаунт?",
    sign_in_existing: "Вход в съществуващ акаунт",
    register_footer_text: "Създавайки акаунт, вие се съгласявате с политиките на платформата и образователните насоки.",
    
    // Validation messages преводи
    password_mismatch: "Паролите не съвпадат",
    password_too_short: "Паролата трябва да бъде поне 6 символа",
    password_weak: "Паролата е твърде слаба",
    email_in_use: "Този имейл вече се използва",
    invalid_email: "Невалиден имейл адрес",
    
    // Register success message
    registration_successful: "Регистрацията е успешна! Добре дошли в IDEAS.",
    
    // Theme toggle преводи
    switch_to_light: "Превключи към светла тема",
    switch_to_dark: "Превключи към тъмна тема",
    
    // Нови преводи за липсващите ключове
    what_to_learn: "Какво да научите",
    explore_courses: "Разгледайте курсове",
    
    // Нови преводи за PrologChat
    prolog_assistant: 'Prolog AI Помощник',
    domain_based_knowledge: 'Базови знание по домейни',
    chat_stats: 'Статистика на чата',
    active_domain: 'Активен домейн',
    domain: 'Домейн',
    no_active_domain: 'Няма активен домейн',
    knowledge_domains: 'Домейни знание',
    clear_domain: 'Изчисти домейн',
    clear_chat: 'Изчисти чат',
    chat: 'Чат',
    code_preview: 'Преглед на код',
    system_commands: 'Системни команди',
    file_management: 'Управление на файлове',
    enter_filename: 'Въведете име на файл (напр., animals.pl)',
    file_command_hint: 'Въведете име на файл по-горе, след което кликнете върху файлова команда',
    responses: 'отговори',
    expand_chat: 'Разшири чата',
    collapse_chat: 'Свий чата',
    loading_domain: 'Зареждане на домейн',
    domain_loaded_success: 'Домейн зареден успешно. Готов за заявки.',
    domain_load_error: 'Грешка при зареждане на домейн',
    thinking: 'Мисля',
    no_server_response: 'Няма отговор от сървъра',
    connection_error: 'Грешка при връзка',
    select_domain_first: 'Първо изберете домейн',
    enter_prolog_query: 'Въведете Prolog заявка за',
    press_enter_to_send: 'Натиснете Enter за изпращане',
    queries_end_with_period: 'Уверете се, че заявките завършват с точка (.)',
    connected_to: 'Свързан с',
    send: 'Изпрати',
    no_domain_selected: 'Няма избран домейн',
    select_domain_to_view: 'Изберете домейн от страничната лента, за да видите неговите кодови файлове.',
    no_code_files_for: 'Няма кодови файлове за',
    upload_code_for_domain: 'Качете кодови файлове за този домейн, за да ги видите тук.',
    files: 'файлове',
    no_domain: 'Няма домейн',
    copy_code: 'Копирай код',
    view_full_code: 'Виж пълния код',
    api_server: 'API сървър',
    queries: 'Заявки',
    code_files: 'Кодови файлове',
    none: 'Няма',
    status: 'Статус',
    animals: 'Животни',
    history: 'История',
    geography: 'География',
    mineral_water: 'Минерална вода',
    animal_facts_description: 'Факти и взаимоотношения за животни',
    historical_facts_description: 'Исторически събития и личности',
    geographical_facts_description: 'Географски факти и местоположения',
    mineral_water_description: 'Източници и свойства на минерални води',
    help: 'Помощ',
    load_all: 'Зареди Всички',
    list_files: 'Списък Файлове',
    clear_facts: 'Изчисти Факти',
    current_file: 'Текущ Файл',
    list_predicates: 'Списък Предикати',
    unload_all: 'Разтовари Всички',
    consult_file: 'Консултирай Файл',
    reconsult_file: 'Повторно Консултирай',
    unload_file: 'Разтовари Файл',
    switch_file: 'Смени Файл',
    example_queries: '📚 Примерни Заявки:\n\n',
    
    // Tooltips
    help_tooltip: 'Покажи информация за помощ',
    load_all_tooltip: 'Зареди всички Prolog файлове',
    list_files_tooltip: 'Изведи списък на всички заредени файлове',
    clear_facts_tooltip: 'Изчисти всички заредени факти',
    current_file_tooltip: 'Покажи текущия активен файл',
    list_predicates_tooltip: 'Изведи списък на всички налични предикати',
    unload_all_tooltip: 'Разтовари всички Prolog файлове',
    consult_file_tooltip: 'Зареди Prolog файл',
    reconsult_file_tooltip: 'Презареди Prolog файл',
    unload_file_tooltip: 'Разтовари Prolog файл',
    switch_file_tooltip: 'Смени на друг файл',
    
    // Балкан преводи
    balkan: 'Балкан',
    balkan_description: 'Балкански източници и свойства',
    central_balkan: 'Централен Балкан',
  },
  es: {
    // Header преводи
    home: 'Inicio',
    topics: 'Temas',
    dashboard: 'Panel',
    prolog_chat: 'Chat Prolog',
    sign_in: 'Iniciar sesión',
    get_started: 'Empezar',
    logout: 'Cerrar sesión',
    innovation_platform: 'Plataforma de innovación',
    
    // Home page преводи
    ideas_acronym: 'Sistema Inteligente de Análisis Educativo de Datos',
    hero_title_part1: 'Transforma la Educación STEM',
    hero_title_part2: 'con Aprendizaje Impulsado por IA',
    hero_description: 'Empodera a los estudiantes con conceptos de programación lógica e inteligencia artificial a través de proyectos STEM interactivos y prácticos.',
    get_started_free: 'Comenzar Gratis',
    view_demos: 'Ver Demostraciones',
    schools: 'Escuelas',
    students: 'Estudiantes',
    projects: 'Proyectos',
    features_title_part1: 'Todo lo que necesitas para enseñar',
    features_title_part2: 'IA y Programación Lógica',
    features_description: 'Herramientas y recursos integrales diseñados específicamente para la educación STEM',
    feature1_title: 'Aprendizaje Impulsado por IA',
    feature1_description: 'Tutoriales interactivos y sistemas de retroalimentación inteligente que se adaptan al ritmo de aprendizaje de cada estudiante.',
    feature2_title: 'Colaboración en Tiempo Real',
    feature2_description: 'Los estudiantes trabajan juntos en proyectos con edición en vivo y retroalimentación instantánea.',
    feature3_title: 'Proyectos Prácticos',
    feature3_description: 'Proyectos STEM prácticos que aplican programación lógica a problemas del mundo real.',
    feature4_title: 'Análisis de Progreso',
    feature4_description: 'Información detallada sobre el rendimiento y patrones de aprendizaje de los estudiantes.',
    feature5_title: 'Integración Curricular',
    feature5_description: 'Se integra perfectamente en los currículos STEM existentes con planes de lecciones listos para usar.',
    feature6_title: 'Habilidades para la Industria',
    feature6_description: 'Prepara a los estudiantes para carreras en IA, ciencia de datos y tecnología.',
    explore_tools: 'Explorar Herramientas de IA',
    start_collaborating: 'Comenzar a Colaborar',
    view_projects: 'Ver Proyectos',
    see_analytics: 'Ver Análisis',
    browse_curriculum: 'Explorar Currículo',
    learn_skills: 'Aprender Habilidades',
    demo_title_part1: 'Ver IDEAS',
    demo_title_part2: 'en Acción',
    demo_description: 'Experimenta cómo nuestra plataforma transforma conceptos de programación complejos en experiencias de aprendizaje atractivas e interactivas que los estudiantes adoran.',
    demo_feature1_title: 'Interfaz de Programación Visual',
    demo_feature1_description: 'Bloques de lógica de arrastrar y soltar para un aprendizaje intuitivo',
    demo_feature2_title: 'Ejecución de Código en Tiempo Real',
    demo_feature2_description: 'Ve los resultados al instante mientras escribes código Prolog',
    demo_feature3_title: 'Tutoriales Interactivos',
    demo_feature3_description: 'Experiencias de aprendizaje guiadas paso a paso',
    demo_feature4_title: 'Espacio de Trabajo Colaborativo',
    demo_feature4_description: 'Trabaja junto con compañeros en tiempo real',
    explore_live_demos: 'Explorar Demostraciones en Vivo',
    try_free_tutorial: 'Probar Tutorial Gratis',
    
    // Footer преводи
    footer_description: 'Empoderando a la próxima generación de innovadores a través de la programación lógica y la educación en IA. Transformando el aprendizaje STEM en todo el mundo.',
    footer_platform: 'Plataforma',
    footer_support: 'Soporte',
    help_center: 'Centro de Ayuda',
    contact_us: 'Contáctanos',
    privacy_policy: 'Política de Privacidad',
    terms_of_service: 'Términos de Servicio',
    documentation: 'Documentación',
    submissions: 'Envíos',
    all_rights_reserved: 'Todos los derechos reservados.',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
    
    // Dashboard преводи (основни)
    welcome_back: '¡Bienvenido de nuevo!',
    upload_code: 'Subir Código',
    upload_file: 'Subir Archivo',
    quick_stats: 'Estadísticas Rápidas',
    total_submissions: 'Total de Envíos',
    success_rate: 'Tasa de Éxito',
    upload_prolog_code: 'Subir Código Prolog',
    upload_prolog_file: 'Subir Archivo Prolog',
    my_submissions: 'Mis Envíos',
    active: 'Activo',
    no_data: 'Sin datos',
    successful: 'Exitosos',
    success_rate_small: 'tasa de éxito',
    file_uploads: 'Archivos Subidos',
    folders: 'carpetas',
    prolog_code_editor: 'Editor de Código Prolog',
    save_draft: 'Guardar Borrador',
    clear: 'Limpiar',
    write_prolog_code: 'Escribe tu código Prolog aquí...',
    example: 'Ejemplo',
    upload_code_button: 'Subir Código',
    clear_editor: 'Limpiar Editor',
    upload_success: '¡Código subido exitosamente!',
    no_file_user: 'No hay archivo seleccionado o usuario no conectado',
    only_pl_files: 'Solo se permiten archivos .pl',
    upload_failed: 'Error al subir:',
    file_upload_success: '¡Archivo subido exitosamente!',
    unexpected_error: 'Ocurrió un error inesperado',
    status_success: 'Éxito',
    status_error: 'Error',
    status_pending: 'Pendiente',
    select_folder: 'Seleccionar Carpeta de Destino:',
    drag_drop_file: 'Arrastra y suelta tu archivo .pl aquí',
    or_click_browse: 'o haz clic para buscar',
    upload_to_folder: 'Subir a',
    clear_selection: 'Limpiar Selección',
    only_pl_files_info: 'Solo se permiten archivos .pl',
    files_saved_in: 'Los archivos se guardarán en:',
    recent_submissions: 'Envíos Recientes',
    all: 'Todos',
    success_filter: 'Exitosos',
    files_filter: 'Archivos',
    no_submissions: 'Aún no hay envíos',
    start_uploading: '¡Comienza subiendo tu primer código o archivo Prolog!',
    upload_first_code: 'Subir Primer Código',
    no_code_preview: 'No hay vista previa del código disponible...',
    view_details: 'Ver Detalles',
    run_again: 'Ejecutar Otra Vez',
    
    // Нови dashboard преводи
    welcome_subtitle: 'Aquí está tu progreso de aprendizaje y las actividades próximas',
    search_placeholder: 'Buscar cursos, lecciones...',
    learning_platform: 'Plataforma de Aprendizaje',
    my_courses: 'Mis Cursos',
    assignments: 'Tareas',
    progress: 'Progreso',
    settings: 'Configuración',
    learning_progress: 'Progreso de Aprendizaje',
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
    all_time: 'Todo el tiempo',
    completion_rate: 'Tasa de Finalización',
    total_study_hours: 'Horas Totales de Estudio',
    completed_tasks: 'Tareas Completadas',
    streak_days: 'Días Consecutivos',
    progress_over_time: 'Progreso en el Tiempo',
    skill_distribution: 'Distribución de Habilidades',
    recent_activity: 'Actividad Reciente',
    completed_assignment: 'Tarea completada',
    uploaded_file: 'Archivo subido',
    achieved_milestone: 'Hito alcanzado',
    browse_files: 'Examinar Archivos',
    or: 'o',
    upload_to: 'Subir a',
    make_first_submission: 'Haz tu primer envío',
    all_assignments: 'Todas las Tareas',
    in_progress: 'En Progreso',
    completed: 'Completado',
    pending: 'Pendiente',
    due: 'Fecha límite',
    tasks: 'tareas',
    details: 'Detalles',
    continue_learning: 'Continuar Aprendiendo',
    complete: 'Completado',
    weekly_progress: 'Progreso Semanal',
    weekly_completion: 'Tasa de finalización semanal',
    learning_hours: 'Horas de Aprendizaje',
    daily_study_hours: 'Horas de estudio diarias esta semana',
    my_assignments: 'Mis Tareas',
    view_all: 'Ver Todo',
    
    // Login page преводи
    login_description: "Continúa tu viaje en la educación STEM impulsada por IA y explora conceptos de programación interactivos.",
    access_projects: "Accede a tus proyectos",
    track_progress: "Sigue tu progreso",
    collaborate_peers: "Colabora con compañeros",
    sign_in_account: "Iniciar sesión en tu cuenta",
    enter_credentials: "Ingresa tus credenciales para continuar aprendiendo",
    email_address: "Dirección de correo electrónico",
    enter_email: "Ingresa tu correo electrónico",
    password: "Contraseña",
    enter_password: "Ingresa tu contraseña",
    remember_me: "Recordarme",
    forgot_password: "¿Olvidaste la contraseña?",
    signing_in: "Iniciando sesión...",
    sign_in_ideas: "Iniciar sesión en IDEAS",
    new_to_ideas: "¿Nuevo en IDEAS?",
    create_account: "Crear una cuenta",
    terms_agreement: "Al continuar, aceptas nuestros",
    and: "y",
    
    // Register page преводи
    register_title: "Únete a la Comunidad IDEAS",
    register_journey_title: "Comienza tu viaje de aprendizaje STEM hoy",
    register_platform_description: "Comienza tu viaje en la educación STEM impulsada por IA y descubre el mundo de la programación lógica y la inteligencia artificial.",
    join_platform: "Únete a la",
    interactive_tutorials: "Tutoriales interactivos",
    hands_on_projects: "Proyectos prácticos",
    collaborative_learning: "Aprendizaje colaborativo",
    progress_tracking: "Seguimiento del progreso",
    create_your_account: "Crea tu cuenta",
    start_stem_journey: "Comienza tu viaje de aprendizaje STEM hoy",
    confirm_password: "Confirmar contraseña",
    confirm_password_placeholder: "Confirma tu contraseña",
    password_placeholder: "Crea una contraseña (mín. 6 caracteres)",
    i_agree_to: "Acepto los",
    send_me_updates: "Envíame recursos educativos y actualizaciones",
    creating_account: "Creando cuenta...",
    create_ideas_account: "Crear cuenta IDEAS",
    already_have_account: "¿Ya tienes una cuenta?",
    sign_in_existing: "Iniciar sesión en cuenta existente",
    register_footer_text: "Al crear una cuenta, aceptas nuestras políticas de plataforma y directrices educativas.",
    
    // Validation messages преводи
    password_mismatch: "Las contraseñas no coinciden",
    password_too_short: "La contraseña debe tener al menos 6 caracteres",
    password_weak: "La contraseña es demasiado débil",
    email_in_use: "Este correo ya está en uso",
    invalid_email: "Correo electrónico inválido",
    
    // Register success message
    registration_successful: "¡Registro exitoso! Bienvenido a IDEAS.",
    
    // Theme toggle преводи
    switch_to_light: "Cambiar a tema claro",
    switch_to_dark: "Cambiar a tema oscuro",
    
    // Нови преводи за липсващите ключове
    what_to_learn: "Qué Aprender",
    explore_courses: "Explorar Cursos",
    
    // Нови преводи за PrologChat
    prolog_assistant: 'Asistente AI de Prolog',
    domain_based_knowledge: 'Conocimiento Basado en Dominios',
    chat_stats: 'Estadísticas del Chat',
    active_domain: 'Dominio Activo',
    domain: 'Dominio',
    no_active_domain: 'Sin Dominio Activo',
    knowledge_domains: 'Dominios de Conocimiento',
    clear_domain: 'Limpiar dominio',
    clear_chat: 'Limpiar Chat',
    chat: 'Chat',
    code_preview: 'Vista Previa de Código',
    system_commands: 'Comandos del Sistema',
    file_management: 'Gestión de Archivos',
    enter_filename: 'Ingrese nombre de archivo (ej., animals.pl)',
    file_command_hint: 'Ingrese nombre de archivo arriba, luego haga clic en un comando de archivo',
    responses: 'respuestas',
    expand_chat: 'Expandir chat',
    collapse_chat: 'Contraer chat',
    loading_domain: 'Cargando dominio',
    domain_loaded_success: 'Dominio cargado exitosamente. Listo para consultas.',
    domain_load_error: 'Error cargando dominio',
    thinking: 'Pensando',
    no_server_response: 'Sin respuesta del servidor',
    connection_error: 'Error de conexión',
    select_domain_first: 'Primero seleccione un dominio',
    enter_prolog_query: 'Ingrese consulta Prolog para',
    press_enter_to_send: 'Presione Enter para enviar',
    queries_end_with_period: 'Asegúrese de que las consultas terminen con un punto (.)',
    connected_to: 'Conectado a',
    send: 'Enviar',
    no_domain_selected: 'Sin Dominio Seleccionado',
    select_domain_to_view: 'Seleccione un dominio de la barra lateral para ver sus archivos de código.',
    no_code_files_for: 'No hay archivos de código para',
    upload_code_for_domain: 'Suba archivos de código para este dominio para verlos aquí.',
    files: 'archivos',
    no_domain: 'Sin dominio',
    copy_code: 'Copiar código',
    view_full_code: 'Ver Código Completo',
    api_server: 'API',
    queries: 'Consultas',
    code_files: 'Archivos de Código',
    none: 'Ninguno',
    status: 'Estado',
    animals: 'Animales',
    history: 'Historia',
    geography: 'Geografía',
    mineral_water: 'Agua Mineral',
    animal_facts_description: 'Datos y relaciones de animales',
    historical_facts_description: 'Eventos históricos y figuras',
    geographical_facts_description: 'Datos geográficos y ubicaciones',
    mineral_water_description: 'Fuentes y propiedades de agua mineral',
    help: 'Ayuda',
    load_all: 'Cargar Todo',
    list_files: 'Listar Archivos',
    clear_facts: 'Limpiar Hechos',
    current_file: 'Archivo Actual',
    list_predicates: 'Listar Predicados',
    unload_all: 'Descargar Todo',
    consult_file: 'Consultar Archivo',
    reconsult_file: 'Reconsultar Archivo',
    unload_file: 'Descargar Archivo',
    switch_file: 'Cambiar Archivo',
    example_queries: '📚 Consultas de Ejemplo:\n\n',
    
    // Tooltips
    help_tooltip: 'Mostrar información de ayuda',
    load_all_tooltip: 'Cargar todos los archivos Prolog',
    list_files_tooltip: 'Listar todos los archivos cargados',
    clear_facts_tooltip: 'Limpiar todos los hechos cargados',
    current_file_tooltip: 'Mostrar archivo activo actual',
    list_predicates_tooltip: 'Listar todos los predicados disponibles',
    unload_all_tooltip: 'Descargar todos los archivos Prolog',
    consult_file_tooltip: 'Cargar un archivo Prolog',
    reconsult_file_tooltip: 'Recargar un archivo Prolog',
    unload_file_tooltip: 'Descargar un archivo Prolog',
    switch_file_tooltip: 'Cambiar a otro archivo',
    
    // Балкан преводи
    balkan: 'Balcanes',
    balkan_description: 'Fuentes y propiedades de los Balcanes',
    central_balkan: 'Balcanes Centrales',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || defaultLanguage;
  });

  const languageOptions: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', label: 'EN' },
    { code: 'bg', name: 'Български', flag: '🇧🇬', label: 'BG' },
    { code: 'es', name: 'Español', flag: '🇪🇸', label: 'ES' },
  ];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key] || key;
  };

  const currentLanguage = languageOptions.find(lang => lang.code === language) || languageOptions[0];

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      languageOptions, 
      currentLanguage,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};