import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'focusflow-study-planner.tasks.v1';
const LEGACY_STORAGE_KEY = 'tasks';
const LANGUAGE_KEY = 'focusflow-study-planner.language';
const SETTINGS_KEY = 'focusflow-study-planner.settings.v1';
const SESSION_KEY = 'focusflow-study-planner.sessions.v1';

const translations = {
  zh: {
    langCode: '中文',
    locale: 'zh-CN',
    appName: 'FocusFlow',
    brandTag: '低阻力学习规划器',
    heroEyebrow: '为 ADHD / 注意力易分散用户设计',
    heroTitle: '把任务变成你现在就能开始的下一步。',
    heroPrimary: '低阻力添加任务',
    heroSecondary: '查看今日聚焦',
    onboarding: {
      eyebrow: '第一次使用',
      title: '不用先规划完整一天，按这 3 步开始就好。',
      steps: ['添加一个小任务', '写下 5 分钟内能开始的下一步', '点击现在开始'],
      action: '从一个任务开始',
      template: '用模板试一下',
    },
    metricsAria: '计划摘要',
    metrics: {
      focus: { label: '今日聚焦' },
      progress: { label: '进行中' },
      week: { label: '本周截止' },
      overdue: { label: '已逾期' },
      sessions: { label: '今日专注' },
      minutes: { label: '累计分钟' },
    },
    templatesTitle: '从模板开始',
    templates: {
      paper: {
        label: '写论文',
        title: '完成论文段落',
        course: '课程论文',
        nextStep: '打开文档，先写出 3 个小标题。',
      },
      presentation: {
        label: '做展示',
        title: '准备课堂展示',
        course: '课堂展示',
        nextStep: '先创建 PPT 文件，写出 3 页大纲。',
      },
      reading: {
        label: '读文献',
        title: '阅读一篇文献',
        course: '文献阅读',
        nextStep: '打开材料，标记 3 个关键词和 1 句重要引用。',
      },
      exam: {
        label: '复习考试',
        title: '复习考试章节',
        course: '考试复习',
        nextStep: '先看目录，列出 5 个不熟的概念。',
      },
      coding: {
        label: '写代码',
        title: '推进代码项目',
        course: '代码项目',
        nextStep: '打开项目，先运行一次测试并记录第一个问题。',
      },
    },
    quickAddEyebrow: '快速输入',
    quickAddTitleCreate: '先抓住任务，再慢慢整理',
    quickAddTitleEdit: '编辑任务',
    cancel: '取消',
    fields: {
      title: '任务标题',
      titlePlaceholder: '完成文献综述导言',
      course: '课程 / 项目',
      coursePlaceholder: '移动与网络应用开发',
      dueDate: '截止日期',
      nextStep: '最小下一步',
      nextStepPlaceholder: '打开文章，标两段引用，再写一句摘要。',
      nextStepGuide: '写一个 5 分钟内就能开始的动作，而不是一个大目标。',
      nextStepAssist: '已根据任务自动建议，可自行修改。',
      effort: '所需精力',
      todayFocus: '加入今日聚焦',
    },
    effortLabels: {
      quick: '5 分钟启动',
      focus: '25 分钟专注',
      deep: '深度专注',
    },
    statusLabels: {
      todo: '待开始',
      in_progress: '进行中',
      done: '已完成',
    },
    submitCreate: '低阻力添加',
    submitEdit: '保存修改',
    focusEyebrow: '今日聚焦',
    focusTitle: '只面对接下来要开始的几件事',
    focusEmptyTitle: '还没有聚焦任务',
    focusEmptyText: '先添加一条任务，并写下一个足够小的下一步，界面会自动保持简洁。',
    focusEmptyAction: '添加一个小任务',
    focusEmptyTemplate: '用写论文模板',
    defaultCourse: '通用学习',
    focusFallback: '先补一个更小的下一步，让开始变得更容易。',
    actions: {
      startNow: '现在开始',
      markDone: '标记完成',
      complete: '完成',
      reopen: '重新打开',
      edit: '编辑',
      delete: '删除',
      addToFocus: '加入聚焦',
      focusedToday: '今日已聚焦',
    },
    focusMode: {
      eyebrow: '专注模式',
      title: '现在只做这一件事',
      timerLabel: '倒计时',
      nextStep: '当前下一步',
      duration: '建议专注时长',
      sessionState: '当前状态',
      running: '专注中',
      paused: '已暂停',
      finished: '本轮完成',
      finishedTitle: '这一轮已经完成',
      finishedHint: '现在不用马上想太多，选一个最顺手的下一步就好。',
      celebration: (minutes) => `你今天已经专注了 ${minutes} 分钟，做得很好。`,
      pause: '暂停',
      resume: '继续',
      reset: '重新开始',
      anotherRound: '再来一轮',
      markTaskDone: '标记任务完成',
      restNow: '休息一下',
      close: '返回规划器',
      completeAndClose: '完成并退出',
      noTask: '这条任务没有写下一步，可以先给自己一个很小的启动动作。',
    },
    libraryEyebrow: '任务库',
    libraryTitle: '看见全部，但不要被全部淹没',
    librarySummary: (completed, total) => `已完成 ${completed} / 总计 ${total}`,
    filters: {
      searchPlaceholder: '搜索标题、课程或下一步',
      allStatuses: '全部状态',
      allEfforts: '全部精力级别',
      allCourses: '全部课程',
    },
    taskFallback: '还没有写下一步。补一条具体动作，启动会轻松很多。',
    taskAvailabilityFocused: '已加入今日聚焦',
    taskAvailabilityOpen: '需要时再开始也可以',
    emptyFilterTitle: '没有符合筛选条件的任务',
    emptyFilterText: '可以先清掉一个筛选条件，或从左侧快速添加一条新任务。',
    noDeadline: '未设置日期',
    due: {
      overdue: '已逾期',
      today: '今天截止',
      prefix: '截止于',
    },
    notificationTitle: 'FocusFlow 提醒',
    deleteConfirm: '要从规划器中删除这条任务吗？',
    themeCalm: '柔和模式',
    themeNight: '夜间模式',
    languageLabel: 'EN',
    jumpFocus: '跳到今日聚焦',
    settings: {
      button: '设置',
      title: '专注设置',
      quickMinutes: '启动时长',
      focusMinutes: '专注时长',
      deepMinutes: '深度时长',
      breakMinutes: '休息时长',
      autoStartBreak: '专注结束后优先推荐休息',
      storageNote: '数据保存在当前浏览器中。清除浏览器数据或更换设备后，本地任务和记录可能无法保留。',
    },
    insights: {
      eyebrow: '专注记录',
      title: '今天做过的事看得见',
      export: '导出今日记录',
      show: '查看记录',
      hide: '收起记录',
      collapsedTitle: '专注记录已收起',
      collapsedText: '为了保持首页轻量，记录和趋势图可以需要时再打开。',
      empty: '完成一轮专注后，这里会自动记录任务和时间。',
      copied: '今日专注记录已复制，可以粘贴到开发过程记录或作业说明中。',
      downloaded: '浏览器已下载今日专注记录。',
      exportEmpty: '今天还没有专注记录，先完成一轮再导出。',
      weekTitle: '7 天专注趋势',
      weekHint: '只显示完成的专注轮次，帮助你看到真实投入。',
      minutes: '分钟',
      sessions: '轮',
    },
    breakMode: {
      title: '休息一下',
      subtitle: '离开屏幕，活动一下，喝口水。',
      state: '休息中',
      finished: '休息完成',
      skip: '结束休息',
      start: '开始休息',
    },
  },
  en: {
    langCode: 'EN',
    locale: 'en-US',
    appName: 'FocusFlow',
    brandTag: 'Low-friction study planner',
    heroEyebrow: 'Built for ADHD and attention-fragile study days',
    heroTitle: 'Turn every task into the next step you can start now.',
    heroPrimary: 'Quick add a task',
    heroSecondary: 'Open today focus',
    onboarding: {
      eyebrow: 'First visit',
      title: 'No need to plan the whole day. Start with these 3 steps.',
      steps: ['Add one tiny task', 'Write a next step you can start in 5 minutes', 'Click Start now'],
      action: 'Start with one task',
      template: 'Try a template',
    },
    metricsAria: 'Planner summary',
    metrics: {
      focus: { label: 'Today focus' },
      progress: { label: 'In progress' },
      week: { label: 'Due this week' },
      overdue: { label: 'Overdue' },
      sessions: { label: 'Focused today' },
      minutes: { label: 'Minutes logged' },
    },
    templatesTitle: 'Start from a template',
    templates: {
      paper: {
        label: 'Paper',
        title: 'Finish a paper section',
        course: 'Course paper',
        nextStep: 'Open the document and write 3 small section headings first.',
      },
      presentation: {
        label: 'Presentation',
        title: 'Prepare a class presentation',
        course: 'Class presentation',
        nextStep: 'Create the slide file and draft the first 3 slide titles.',
      },
      reading: {
        label: 'Reading',
        title: 'Read one source',
        course: 'Reading',
        nextStep: 'Open the source, mark 3 keywords, and save 1 useful quote.',
      },
      exam: {
        label: 'Exam review',
        title: 'Review an exam chapter',
        course: 'Exam review',
        nextStep: 'Scan the chapter outline and list 5 concepts that feel unclear.',
      },
      coding: {
        label: 'Coding',
        title: 'Move the coding project forward',
        course: 'Coding project',
        nextStep: 'Open the project, run the tests once, and note the first issue.',
      },
    },
    quickAddEyebrow: 'Quick capture',
    quickAddTitleCreate: 'Catch the task before it disappears',
    quickAddTitleEdit: 'Edit task',
    cancel: 'Cancel',
    fields: {
      title: 'Task title',
      titlePlaceholder: 'Finish the literature review introduction',
      course: 'Course / project',
      coursePlaceholder: 'Mobile and Web Development',
      dueDate: 'Due date',
      nextStep: 'Smallest next step',
      nextStepPlaceholder: 'Open the article, highlight two quotes, and write one summary sentence.',
      nextStepGuide: 'Write an action you can begin within 5 minutes, not a big goal.',
      nextStepAssist: 'Auto-suggested from the task. You can edit it.',
      effort: 'Energy needed',
      todayFocus: 'Add to today focus',
    },
    effortLabels: {
      quick: '5-minute start',
      focus: '25-minute focus',
      deep: 'Deep focus',
    },
    statusLabels: {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
    },
    submitCreate: 'Add with low friction',
    submitEdit: 'Save changes',
    focusEyebrow: 'Today focus',
    focusTitle: 'Only the next few things to begin',
    focusEmptyTitle: 'No focus tasks yet',
    focusEmptyText:
      'Add one task with a very small next step. The interface is intentionally designed to stay quiet.',
    focusEmptyAction: 'Add a tiny task',
    focusEmptyTemplate: 'Use paper template',
    defaultCourse: 'General study',
    focusFallback: 'Add one tiny next step so starting feels lighter.',
    actions: {
      startNow: 'Start now',
      markDone: 'Mark done',
      complete: 'Complete',
      reopen: 'Re-open',
      edit: 'Edit',
      delete: 'Delete',
      addToFocus: 'Add to focus',
      focusedToday: 'Focused today',
    },
    focusMode: {
      eyebrow: 'Focus mode',
      title: 'Only this one thing for now',
      timerLabel: 'Countdown',
      nextStep: 'Current next step',
      duration: 'Suggested focus length',
      sessionState: 'Session status',
      running: 'Running',
      paused: 'Paused',
      finished: 'Finished',
      finishedTitle: 'This round is complete',
      finishedHint: 'No need to decide everything. Choose the next easiest move.',
      celebration: (minutes) => `You have focused for ${minutes} minutes today. Nice work.`,
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset',
      anotherRound: 'Another round',
      markTaskDone: 'Mark task done',
      restNow: 'Take a break',
      close: 'Back to planner',
      completeAndClose: 'Finish and close',
      noTask: 'There is no next step yet, so give yourself one tiny action to begin with.',
    },
    libraryEyebrow: 'Task library',
    libraryTitle: 'See everything without being flooded by everything',
    librarySummary: (completed, total) => `${completed} completed / ${total} total`,
    filters: {
      searchPlaceholder: 'Search title, course, or next step',
      allStatuses: 'All statuses',
      allEfforts: 'All energy levels',
      allCourses: 'All courses',
    },
    taskFallback: 'No next step yet. Add one concrete action to make starting easier.',
    taskAvailabilityFocused: 'Pinned for today',
    taskAvailabilityOpen: 'Available whenever you are ready',
    emptyFilterTitle: 'No tasks match these filters',
    emptyFilterText: 'Try clearing one filter, or add a new low-friction task from the capture panel.',
    noDeadline: 'No deadline',
    due: {
      overdue: 'Overdue',
      today: 'Due today',
      prefix: 'Due',
    },
    notificationTitle: 'FocusFlow reminder',
    deleteConfirm: 'Remove this task from your planner?',
    themeCalm: 'Calm mode',
    themeNight: 'Night mode',
    languageLabel: '中文',
    jumpFocus: 'Jump to today focus',
    settings: {
      button: 'Settings',
      title: 'Focus settings',
      quickMinutes: 'Quick start',
      focusMinutes: 'Focus round',
      deepMinutes: 'Deep round',
      breakMinutes: 'Break length',
      autoStartBreak: 'Prioritize break after work',
      storageNote:
        'Data is saved in this browser. If browser data is cleared or you switch devices, local tasks and logs may not carry over.',
    },
    insights: {
      eyebrow: 'Focus log',
      title: 'Make today’s work visible',
      export: 'Export today log',
      show: 'Show log',
      hide: 'Hide log',
      collapsedTitle: 'Focus log is tucked away',
      collapsedText: 'To keep the home page light, open logs and trends only when you need them.',
      empty: 'After a completed focus round, the task and time will appear here.',
      copied: 'Today’s focus log was copied. You can paste it into your project notes.',
      downloaded: 'The browser downloaded today’s focus log.',
      exportEmpty: 'No focus sessions yet today. Finish one round before exporting.',
      weekTitle: '7-day focus trend',
      weekHint: 'Only completed focus rounds are counted, so the chart reflects real work.',
      minutes: 'min',
      sessions: 'sessions',
    },
    breakMode: {
      title: 'Take a break',
      subtitle: 'Step back, stretch, breathe, and let your eyes rest.',
      state: 'On break',
      finished: 'Break complete',
      skip: 'End break',
      start: 'Start break',
    },
  },
};

const defaultForm = {
  title: '',
  course: '',
  nextStep: '',
  effort: 'quick',
  dueDate: '',
  todayFocus: true,
};

const defaultSettings = {
  quickMinutes: 5,
  focusMinutes: 25,
  deepMinutes: 45,
  breakMinutes: 5,
  autoStartBreak: true,
};

const taskTemplates = ['paper', 'presentation', 'reading', 'exam', 'coding'];

const suggestionRules = [
  {
    pattern: /论文|paper|essay|report|报告|写作|writing|literature|文献综述/i,
    zh: '打开文档，先写出 3 个小标题。',
    en: 'Open the document and write 3 small section headings first.',
  },
  {
    pattern: /展示|演示|presentation|ppt|slides|deck|答辩/i,
    zh: '先创建 PPT 文件，写出 3 页大纲。',
    en: 'Create the slide file and draft the first 3 slide titles.',
  },
  {
    pattern: /阅读|文献|article|reading|source|paper review/i,
    zh: '打开材料，标记 3 个关键词和 1 句重要引用。',
    en: 'Open the source, mark 3 keywords, and save 1 useful quote.',
  },
  {
    pattern: /考试|复习|exam|quiz|test|midterm|final/i,
    zh: '先看目录，列出 5 个不熟的概念。',
    en: 'Scan the outline and list 5 concepts that feel unclear.',
  },
  {
    pattern: /吃饭|早餐|午饭|晚饭|外卖|meal|breakfast|lunch|dinner/i,
    zh: '先站起来，准备食物或打开外卖页面。',
    en: 'Stand up first, then prepare food or open the delivery page.',
  },
  {
    pattern: /代码|编程|开发|code|coding|program|react|bug|debug/i,
    zh: '打开项目，先运行一次测试并记录第一个问题。',
    en: 'Open the project, run the tests once, and note the first issue.',
  },
];

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLastSevenDateKeys(todayKey) {
  const today = new Date(`${todayKey}T12:00:00`);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return getLocalDateKey(date);
  });
}

function formatSessionTime(isoString, locale) {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

function normalizeTask(task) {
  const priorityToEffort = {
    高: 'deep',
    普通: 'focus',
    低: 'quick',
  };

  return {
    id: task.id ?? Date.now(),
    title: task.title ?? '',
    course: task.course ?? '',
    nextStep: task.nextStep ?? task.desc ?? '',
    effort: task.effort ?? priorityToEffort[task.priority] ?? 'quick',
    dueDate: task.dueDate ?? (task.remindTime ? task.remindTime.slice(0, 10) : ''),
    status: task.status ?? (task.done ? 'done' : 'todo'),
    todayFocus: task.todayFocus ?? false,
    notified: task.notified ?? false,
    createdAt: task.createdAt ?? new Date().toISOString(),
  };
}

function loadInitialTasks() {
  const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeTask) : [];
  } catch (error) {
    console.error('Failed to parse stored tasks', error);
    return [];
  }
}

function loadInitialLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === 'zh' || stored === 'en') {
    return stored;
  }
  return 'zh';
}

function loadInitialSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      quickMinutes: Number(parsed.quickMinutes) || defaultSettings.quickMinutes,
      focusMinutes: Number(parsed.focusMinutes) || defaultSettings.focusMinutes,
      deepMinutes: Number(parsed.deepMinutes) || defaultSettings.deepMinutes,
      breakMinutes: Number(parsed.breakMinutes) || defaultSettings.breakMinutes,
      autoStartBreak:
        typeof parsed.autoStartBreak === 'boolean'
          ? parsed.autoStartBreak
          : defaultSettings.autoStartBreak,
    };
  } catch (error) {
    console.error('Failed to parse settings', error);
    return defaultSettings;
  }
}

function loadInitialSessions() {
  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse focus sessions', error);
    return [];
  }
}

function suggestNextStep(title, course, language) {
  const source = `${title} ${course}`.trim();

  if (!source) {
    return '';
  }

  const matchedRule = suggestionRules.find((rule) => rule.pattern.test(source));
  if (matchedRule) {
    return matchedRule[language];
  }

  return language === 'zh'
    ? '先准备相关东西，然后做一个 5 分钟能完成的小动作。'
    : 'Prepare the related item first, then finish one action small enough for 5 minutes.';
}

function formatDueDate(dueDate, locale, fallbackText) {
  if (!dueDate) {
    return fallbackText;
  }

  const parsed = new Date(`${dueDate}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? dueDate
    : parsed.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

function compareByPriority(a, b, todayKey) {
  const score = (task) => {
    let value = 0;
    if (task.todayFocus) value += 30;
    if (task.status === 'in_progress') value += 20;
    if (task.dueDate && task.dueDate < todayKey) value += 15;
    if (task.dueDate === todayKey) value += 10;
    if (task.effort === 'quick') value += 4;
    if (task.effort === 'focus') value += 2;
    return value;
  };

  const scoreDiff = score(b) - score(a);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }
  if (!a.dueDate && b.dueDate) return 1;
  if (a.dueDate && !b.dueDate) return -1;
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  return a.createdAt.localeCompare(b.createdAt);
}

function getSuggestedMinutes(effort, settings) {
  if (effort === 'quick') return settings.quickMinutes;
  if (effort === 'deep') return settings.deepMinutes;
  return settings.focusMinutes;
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function App() {
  const [tasks, setTasks] = useState(loadInitialTasks);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [effortFilter, setEffortFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [theme, setTheme] = useState('calm');
  const [language, setLanguage] = useState(loadInitialLanguage);
  const [settings, setSettings] = useState(loadInitialSettings);
  const [focusSessions, setFocusSessions] = useState(loadInitialSessions);
  const [showSettings, setShowSettings] = useState(false);
  const [showInsights, setShowInsights] = useState(() => loadInitialSessions().length > 0);
  const [activeFocusTaskId, setActiveFocusTaskId] = useState(null);
  const [focusPhase, setFocusPhase] = useState('work');
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(0);
  const [focusIsRunning, setFocusIsRunning] = useState(false);
  const nextStepRef = useRef(null);

  const t = translations[language];
  const todayKey = getLocalDateKey();
  const supportsNotifications = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    if (focusSessions.length > 0) {
      setShowInsights(true);
    }
  }, [focusSessions.length]);

  useEffect(() => {
    if (supportsNotifications && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [supportsNotifications]);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          const isDueNow = task.dueDate && task.dueDate <= todayKey;
          const isPending = task.status !== 'done';

          if (!isDueNow || !isPending || task.notified) {
            return task;
          }

          if (supportsNotifications && Notification.permission === 'granted') {
            new Notification(t.notificationTitle, {
              body: `${task.title}${task.nextStep ? ` - ${task.nextStep}` : ''}`,
            });
          }

          return { ...task, notified: true };
        })
      );
    }, 30000);

    return () => window.clearInterval(timer);
  }, [supportsNotifications, t.notificationTitle, todayKey]);

  const courses = [...new Set(tasks.map((task) => task.course).filter(Boolean))].sort();

  const activeFocusTask = activeFocusTaskId
    ? tasks.find((task) => task.id === activeFocusTaskId) ?? null
    : null;

  const activeFocusDurationMinutes = activeFocusTask
    ? focusPhase === 'break'
      ? settings.breakMinutes
      : getSuggestedMinutes(activeFocusTask.effort, settings)
    : 0;
  const isFocusFinished = activeFocusTask ? focusSecondsLeft === 0 : false;

  const focusTasks = tasks
    .filter((task) => task.status !== 'done' && task.todayFocus)
    .sort((a, b) => compareByPriority(a, b, todayKey))
    .slice(0, 3);

  const todaySessions = focusSessions.filter((session) => session.date === todayKey);
  const weekDateKeys = getLastSevenDateKeys(todayKey);
  const weeklyFocusData = weekDateKeys.map((dateKey) => {
    const sessions = focusSessions.filter((session) => session.date === dateKey);
    const minutes = sessions.reduce((total, session) => total + (Number(session.minutes) || 0), 0);
    const parsedDate = new Date(`${dateKey}T12:00:00`);

    return {
      dateKey,
      minutes,
      sessions: sessions.length,
      label: parsedDate.toLocaleDateString(t.locale, { weekday: 'short' }),
    };
  });
  const maxWeekMinutes = Math.max(1, ...weeklyFocusData.map((day) => day.minutes));

  const metrics = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'done').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    overdue: tasks.filter(
      (task) => task.status !== 'done' && task.dueDate && task.dueDate < todayKey
    ).length,
    dueThisWeek: tasks.filter((task) => {
      if (task.status === 'done' || !task.dueDate) {
        return false;
      }

      const dueDate = new Date(`${task.dueDate}T12:00:00`);
      const now = new Date(`${todayKey}T12:00:00`);
      const diffDays = Math.round((dueDate - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length,
    sessionsToday: todaySessions.length,
    minutesToday: todaySessions.reduce((total, session) => total + (Number(session.minutes) || 0), 0),
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = [task.title, task.course, task.nextStep]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesEffort = effortFilter === 'all' || task.effort === effortFilter;
      const matchesCourse = courseFilter === 'all' || task.course === courseFilter;
      return matchesSearch && matchesStatus && matchesEffort && matchesCourse;
    })
    .sort((a, b) => compareByPriority(a, b, todayKey));

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if ((field === 'title' || field === 'course') && !current.nextStep.trim()) {
        next.nextStep = suggestNextStep(
          field === 'title' ? value : current.title,
          field === 'course' ? value : current.course,
          language
        );
      }

      return next;
    });
  };

  const applyTemplate = (templateKey) => {
    const template = t.templates[templateKey];
    setEditingId(null);
    setForm({
      title: template.title,
      course: template.course,
      nextStep: template.nextStep,
      effort: templateKey === 'paper' || templateKey === 'coding' ? 'focus' : 'quick',
      dueDate: '',
      todayFocus: true,
    });
  };

  const focusNextStepField = () => {
    window.setTimeout(() => {
      nextStepRef.current?.focus();
    }, 0);
  };

  const handleFormKeyDown = (event) => {
    const isComposing = event.nativeEvent?.isComposing || event.keyCode === 229;
    const isTextarea = event.target.tagName === 'TEXTAREA';
    const isSubmitButton = event.target.type === 'submit';

    if (event.key === 'Enter' && !isComposing && !isTextarea && !isSubmitButton) {
      event.preventDefault();
      focusNextStepField();
    }
  };

  const downloadFocusLog = (content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FocusFlow-${todayKey}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    window.alert(t.insights.downloaded);
  };

  const exportTodayRecord = () => {
    if (todaySessions.length === 0) {
      window.alert(t.insights.exportEmpty);
      return;
    }

    const heading =
      language === 'zh'
        ? `FocusFlow 今日专注记录 - ${todayKey}`
        : `FocusFlow Today Focus Log - ${todayKey}`;
    const summary =
      language === 'zh'
        ? `共完成 ${metrics.sessionsToday} 轮，累计 ${metrics.minutesToday} 分钟。`
        : `${metrics.sessionsToday} sessions completed, ${metrics.minutesToday} minutes logged.`;
    const details = todaySessions
      .map((session, index) => {
        const time = formatSessionTime(session.completedAt, t.locale);
        return `${index + 1}. ${time} - ${session.taskTitle} (${session.minutes} ${t.insights.minutes})`;
      })
      .join('\n');
    const content = `${heading}\n${summary}\n\n${details}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(content)
        .then(() => window.alert(t.insights.copied))
        .catch(() => downloadFocusLog(content));
      return;
    }

    downloadFocusLog(content);
  };

  const recordFocusSession = useCallback((task, minutes, phase) => {
    if (!task || phase !== 'work') {
      return;
    }

    setFocusSessions((currentSessions) => [
      {
        id: `${Date.now()}-${task.id}`,
        taskId: task.id,
        taskTitle: task.title,
        minutes,
        date: getLocalDateKey(),
        completedAt: new Date().toISOString(),
      },
      ...currentSessions,
    ]);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      return;
    }

    if (!form.nextStep.trim()) {
      const suggestedNextStep = suggestNextStep(form.title, form.course, language);
      setForm((current) => ({
        ...current,
        nextStep: suggestedNextStep,
      }));
      focusNextStepField();
      return;
    }

    const currentTask = editingId ? tasks.find((task) => task.id === editingId) : null;
    const nextTask = normalizeTask({
      id: editingId ?? Date.now(),
      title: form.title.trim(),
      course: form.course.trim(),
      nextStep: form.nextStep.trim(),
      effort: form.effort,
      dueDate: form.dueDate,
      todayFocus: form.todayFocus,
      status: currentTask?.status ?? 'todo',
      notified: false,
      createdAt: currentTask?.createdAt ?? new Date().toISOString(),
    });

    setTasks((currentTasks) =>
      editingId
        ? currentTasks.map((task) => (task.id === editingId ? nextTask : task))
        : [nextTask, ...currentTasks]
    );

    resetForm();
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      course: task.course,
      nextStep: task.nextStep,
      effort: task.effort,
      dueDate: task.dueDate,
      todayFocus: task.todayFocus,
    });
  };

  const updateTask = (id, updates) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              notified:
                updates.dueDate || updates.status
                  ? updates.status === 'done'
                    ? true
                    : false
                  : task.notified,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm(t.deleteConfirm)) {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      if (activeFocusTaskId === id) {
        setActiveFocusTaskId(null);
        setFocusPhase('work');
        setFocusIsRunning(false);
        setFocusSecondsLeft(0);
      }
    }
  };

  const startFocusSession = (task) => {
    updateTask(task.id, { status: 'in_progress', todayFocus: true });
    setActiveFocusTaskId(task.id);
    setFocusPhase('work');
    setFocusSecondsLeft(getSuggestedMinutes(task.effort, settings) * 60);
    setFocusIsRunning(true);
  };

  const completeFocusSession = () => {
    if (!activeFocusTask) {
      return;
    }

    if (focusPhase === 'work' && focusSecondsLeft > 0) {
      recordFocusSession(activeFocusTask, activeFocusDurationMinutes, focusPhase);
    }
    updateTask(activeFocusTask.id, { status: 'done', todayFocus: false });
    setActiveFocusTaskId(null);
    setFocusPhase('work');
    setFocusIsRunning(false);
    setFocusSecondsLeft(0);
  };

  const closeFocusSession = () => {
    setActiveFocusTaskId(null);
    setFocusPhase('work');
    setFocusIsRunning(false);
    setFocusSecondsLeft(0);
  };

  const resetFocusSession = () => {
    if (!activeFocusTask) {
      return;
    }

    setFocusSecondsLeft(
      (focusPhase === 'break'
        ? settings.breakMinutes
        : getSuggestedMinutes(activeFocusTask.effort, settings)) * 60
    );
    setFocusIsRunning(true);
  };

  const startBreakSession = () => {
    setFocusPhase('break');
    setFocusSecondsLeft(settings.breakMinutes * 60);
    setFocusIsRunning(true);
  };

  const handleSettingsChange = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]:
        field === 'autoStartBreak'
          ? value
          : Math.max(1, Math.min(90, Number(value) || defaultSettings[field])),
    }));
  };

  useEffect(() => {
    if (!activeFocusTask || !focusIsRunning || focusSecondsLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setFocusSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          if (focusPhase === 'work') {
            recordFocusSession(activeFocusTask, activeFocusDurationMinutes, focusPhase);
          }
          setFocusIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeFocusTask, activeFocusDurationMinutes, focusIsRunning, focusPhase, focusSecondsLeft, recordFocusSession]);

  const getDueState = (task) => {
    if (!task.dueDate || task.status === 'done') {
      return null;
    }

    if (task.dueDate < todayKey) {
      return { label: t.due.overdue, tone: 'danger' };
    }

    if (task.dueDate === todayKey) {
      return { label: t.due.today, tone: 'warning' };
    }

    return {
      label: `${t.due.prefix} ${formatDueDate(task.dueDate, t.locale, t.noDeadline)}`,
      tone: 'neutral',
    };
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="app-backdrop" />
      {activeFocusTask ? (
        <div className="focus-overlay" role="dialog" aria-modal="true" aria-labelledby="focus-mode-title">
          <div className="focus-overlay__scrim" onClick={closeFocusSession} />
          <section className="focus-modal">
            <div className="focus-modal__topline">
              <p className="panel-kicker">{t.focusMode.eyebrow}</p>
              <button className="ghost-button" type="button" onClick={closeFocusSession}>
                {t.focusMode.close}
              </button>
            </div>

            <div className="focus-modal__body">
              <div className="focus-modal__meta">
                <span className="chip">{activeFocusTask.course || t.defaultCourse}</span>
                <span className={`chip tone-${activeFocusTask.effort}`}>
                  {t.effortLabels[activeFocusTask.effort]}
                </span>
                {getDueState(activeFocusTask) ? (
                  <span className={`chip tone-${getDueState(activeFocusTask).tone}`}>
                    {getDueState(activeFocusTask).label}
                  </span>
                ) : null}
              </div>

              <h2 id="focus-mode-title">
                {isFocusFinished && focusPhase === 'work' ? t.focusMode.finishedTitle : t.focusMode.title}
              </h2>
              <h3 className="focus-modal__task-title">
                {focusPhase === 'break' ? t.breakMode.title : activeFocusTask.title}
              </h3>
              {isFocusFinished && focusPhase === 'work' ? (
                <>
                  <p className="focus-modal__subtitle">{t.focusMode.finishedHint}</p>
                  <p className="completion-badge">{t.focusMode.celebration(metrics.minutesToday)}</p>
                </>
              ) : null}

              <div className="focus-countdown-panel">
                <span className="metric-label">{t.focusMode.timerLabel}</span>
                <strong className="focus-countdown">{formatSeconds(focusSecondsLeft)}</strong>
                <p className="focus-status-line">
                  <span className="chip tone-neutral">
                    {isFocusFinished
                      ? focusPhase === 'break'
                        ? t.breakMode.finished
                        : t.focusMode.finished
                      : focusIsRunning
                        ? focusPhase === 'break'
                          ? t.breakMode.state
                          : t.focusMode.running
                        : t.focusMode.paused}
                  </span>
                  <span>
                    {t.focusMode.duration}: {activeFocusDurationMinutes} min
                  </span>
                </p>
              </div>

              <div className="focus-modal__grid">
                <article className="focus-modal__card">
                  <span className="metric-label">{t.focusMode.nextStep}</span>
                  <p>
                    {focusPhase === 'break'
                      ? t.breakMode.subtitle
                      : activeFocusTask.nextStep || t.focusMode.noTask}
                  </p>
                </article>
                <article className="focus-modal__card">
                  <span className="metric-label">{t.focusMode.sessionState}</span>
                  <strong>
                    {focusPhase === 'break'
                      ? isFocusFinished
                        ? t.breakMode.finished
                        : t.breakMode.state
                      : activeFocusTask.todayFocus
                        ? t.taskAvailabilityFocused
                        : t.taskAvailabilityOpen}
                  </strong>
                </article>
              </div>

              <div className="focus-modal__actions">
                {isFocusFinished && focusPhase === 'work' ? (
                  <>
                    {settings.autoStartBreak ? (
                      <button className="primary-button" type="button" onClick={startBreakSession}>
                        {t.focusMode.restNow}
                      </button>
                    ) : null}
                    <button
                      className={settings.autoStartBreak ? 'secondary-button' : 'primary-button'}
                      type="button"
                      onClick={completeFocusSession}
                    >
                      {t.focusMode.markTaskDone}
                    </button>
                    <button className="secondary-button" type="button" onClick={resetFocusSession}>
                      {t.focusMode.anotherRound}
                    </button>
                    {!settings.autoStartBreak ? (
                      <button className="secondary-button" type="button" onClick={startBreakSession}>
                        {t.focusMode.restNow}
                      </button>
                    ) : null}
                    <button className="ghost-button" type="button" onClick={closeFocusSession}>
                      {t.focusMode.close}
                    </button>
                  </>
                ) : (
                  <>
                    {!isFocusFinished ? (
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => setFocusIsRunning((current) => !current)}
                      >
                        {focusIsRunning ? t.focusMode.pause : t.focusMode.resume}
                      </button>
                    ) : null}
                    <button className="secondary-button" type="button" onClick={resetFocusSession}>
                      {t.focusMode.reset}
                    </button>
                    {focusPhase === 'work' ? (
                      <button className="secondary-button" type="button" onClick={completeFocusSession}>
                        {t.focusMode.completeAndClose}
                      </button>
                    ) : (
                      <button className="secondary-button" type="button" onClick={closeFocusSession}>
                        {t.breakMode.skip}
                      </button>
                    )}
                    <button className="ghost-button" type="button" onClick={closeFocusSession}>
                      {t.focusMode.close}
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
      <main className="planner-layout">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark">F</div>
            <div>
              <p className="brand-name">{t.appName}</p>
              <p className="brand-tag">{t.brandTag}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className={`lang-toggle ${showSettings ? 'active' : ''}`}
              type="button"
              onClick={() => setShowSettings((current) => !current)}
            >
              {t.settings.button}
            </button>
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))}
              aria-label="Toggle language"
            >
              {t.languageLabel}
            </button>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme((current) => (current === 'calm' ? 'night' : 'calm'))}
            >
              {theme === 'calm' ? t.themeNight : t.themeCalm}
            </button>
          </div>
        </header>

        {showSettings ? (
          <section className="settings-panel">
            <div className="settings-panel__header">
              <p className="panel-kicker">{t.settings.title}</p>
            </div>
            <div className="settings-grid">
              <label>
                {t.settings.quickMinutes}
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.quickMinutes}
                  onChange={(event) => handleSettingsChange('quickMinutes', event.target.value)}
                />
              </label>
              <label>
                {t.settings.focusMinutes}
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.focusMinutes}
                  onChange={(event) => handleSettingsChange('focusMinutes', event.target.value)}
                />
              </label>
              <label>
                {t.settings.deepMinutes}
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.deepMinutes}
                  onChange={(event) => handleSettingsChange('deepMinutes', event.target.value)}
                />
              </label>
              <label>
                {t.settings.breakMinutes}
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.breakMinutes}
                  onChange={(event) => handleSettingsChange('breakMinutes', event.target.value)}
                />
              </label>
              <label className="checkbox-field settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.autoStartBreak}
                  onChange={(event) => handleSettingsChange('autoStartBreak', event.target.checked)}
                />
                {t.settings.autoStartBreak}
              </label>
            </div>
            <p className="storage-note">{t.settings.storageNote}</p>
          </section>
        ) : null}

        <section className="hero-layout">
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">{t.heroEyebrow}</p>
              <h1>{t.heroTitle}</h1>
            </div>

            <div className="hero-actions">
              <a className="primary-button" href="#quick-add">
                {t.heroPrimary}
              </a>
              <a className="ghost-button" href="#today-focus">
                {t.heroSecondary}
              </a>
            </div>
          </section>
        </section>

        <section className="metrics-grid" aria-label={t.metricsAria}>
          <article className="metric-card">
            <span className="metric-label">{t.metrics.focus.label}</span>
            <strong>{focusTasks.length}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">{t.metrics.progress.label}</span>
            <strong>{metrics.inProgress}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">{t.metrics.week.label}</span>
            <strong>{metrics.dueThisWeek}</strong>
          </article>
          <article className="metric-card danger">
            <span className="metric-label">{t.metrics.overdue.label}</span>
            <strong>{metrics.overdue}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">{t.metrics.sessions.label}</span>
            <strong>{metrics.sessionsToday}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">{t.metrics.minutes.label}</span>
            <strong>{metrics.minutesToday}</strong>
          </article>
        </section>

        {tasks.length === 0 ? (
          <section className="onboarding-panel">
            <div>
              <p className="panel-kicker">{t.onboarding.eyebrow}</p>
              <h2>{t.onboarding.title}</h2>
            </div>
            <div className="onboarding-steps">
              {t.onboarding.steps.map((step, index) => (
                <span key={step}>
                  <strong>{index + 1}</strong>
                  {step}
                </span>
              ))}
            </div>
            <div className="onboarding-actions">
              <a className="primary-button" href="#quick-add">
                {t.onboarding.action}
              </a>
              <button className="ghost-button" type="button" onClick={() => applyTemplate('paper')}>
                {t.onboarding.template}
              </button>
            </div>
          </section>
        ) : null}

        {showInsights ? (
          <section className="insights-grid" aria-label={t.insights.eyebrow}>
            <article className="panel insight-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">{t.insights.eyebrow}</p>
                  <h2>{t.insights.title}</h2>
                </div>
                <div className="panel-actions">
                  <button className="ghost-button" type="button" onClick={exportTodayRecord}>
                    {t.insights.export}
                  </button>
                  <button className="ghost-button" type="button" onClick={() => setShowInsights(false)}>
                    {t.insights.hide}
                  </button>
                </div>
              </div>

              <div className="history-list">
                {todaySessions.length > 0 ? (
                  todaySessions.slice(0, 5).map((session) => (
                    <article className="history-item" key={session.id}>
                      <span className="history-time">{formatSessionTime(session.completedAt, t.locale)}</span>
                      <div>
                        <strong>{session.taskTitle}</strong>
                        <p>
                          {session.minutes} {t.insights.minutes}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty-state compact">
                    <p>{t.insights.empty}</p>
                  </div>
                )}
              </div>
            </article>

            <article className="panel insight-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">{t.insights.weekTitle}</p>
                  <h2>{metrics.minutesToday} {t.insights.minutes}</h2>
                  <p className="panel-note">{t.insights.weekHint}</p>
                </div>
              </div>

              <div className="trend-chart">
                {weeklyFocusData.map((day) => {
                  const fillHeight = day.minutes > 0 ? Math.max(12, (day.minutes / maxWeekMinutes) * 100) : 0;

                  return (
                    <div className="trend-day" key={day.dateKey}>
                      <div className="trend-bar" aria-label={`${day.label}: ${day.minutes} ${t.insights.minutes}`}>
                        <span className="trend-fill" style={{ height: `${fillHeight}%` }} />
                      </div>
                      <span>{day.label}</span>
                      <strong>{day.minutes}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        ) : (
          <section className="panel insights-collapsed">
            <div>
              <p className="panel-kicker">{t.insights.eyebrow}</p>
              <h2>{t.insights.collapsedTitle}</h2>
              <p>{t.insights.collapsedText}</p>
            </div>
            <button className="secondary-button" type="button" onClick={() => setShowInsights(true)}>
              {t.insights.show}
            </button>
          </section>
        )}

        <div className="content-grid">
          <section className="panel form-panel" id="quick-add">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">{t.quickAddEyebrow}</p>
                <h2>{editingId ? t.quickAddTitleEdit : t.quickAddTitleCreate}</h2>
              </div>
              {editingId ? (
                <button className="ghost-button" type="button" onClick={resetForm}>
                  {t.cancel}
                </button>
              ) : null}
            </div>

            {!editingId ? (
              <div className="template-strip" aria-label={t.templatesTitle}>
                <span>{t.templatesTitle}</span>
                {taskTemplates.map((templateKey) => (
                  <button
                    className="template-chip"
                    key={templateKey}
                    type="button"
                    onClick={() => applyTemplate(templateKey)}
                  >
                    {t.templates[templateKey].label}
                  </button>
                ))}
              </div>
            ) : null}

            <form className="task-form" onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
              <label>
                {t.fields.title}
                <input
                  value={form.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                  placeholder={t.fields.titlePlaceholder}
                />
              </label>

              <div className="form-row">
                <label>
                  {t.fields.course}
                  <input
                    value={form.course}
                    onChange={(event) => handleChange('course', event.target.value)}
                    placeholder={t.fields.coursePlaceholder}
                  />
                </label>

                <label>
                  {t.fields.dueDate}
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => handleChange('dueDate', event.target.value)}
                  />
                </label>
              </div>

              <label className="next-step-field">
                <span className="field-title">
                  <span>{t.fields.nextStep}</span>
                  <small>{t.fields.nextStepGuide}</small>
                </span>
                <textarea
                  ref={nextStepRef}
                  rows="3"
                  value={form.nextStep}
                  onChange={(event) => handleChange('nextStep', event.target.value)}
                  placeholder={t.fields.nextStepPlaceholder}
                />
                {form.nextStep ? <span className="assist-note">{t.fields.nextStepAssist}</span> : null}
              </label>

              <div className="form-row">
                <label>
                  {t.fields.effort}
                  <select
                    value={form.effort}
                    onChange={(event) => handleChange('effort', event.target.value)}
                  >
                    {Object.entries(t.effortLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={form.todayFocus}
                    onChange={(event) => handleChange('todayFocus', event.target.checked)}
                  />
                  {t.fields.todayFocus}
                </label>
              </div>

              <button className="primary-button" type="submit">
                {editingId ? t.submitEdit : t.submitCreate}
              </button>
            </form>
          </section>

          <section className="panel focus-panel" id="today-focus">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">{t.focusEyebrow}</p>
                <h2>{t.focusTitle}</h2>
              </div>
            </div>

            <div className="focus-stack">
              {focusTasks.length > 0 ? (
                focusTasks.map((task) => {
                  const dueState = getDueState(task);

                  return (
                    <article className="focus-card" key={task.id}>
                      <div className="focus-meta">
                        <span className="chip">{task.course || t.defaultCourse}</span>
                        <span className={`chip tone-${task.effort}`}>
                          {t.effortLabels[task.effort]}
                        </span>
                        {dueState ? <span className={`chip tone-${dueState.tone}`}>{dueState.label}</span> : null}
                      </div>
                      <h3>{task.title}</h3>
                      <p>{task.nextStep || t.focusFallback}</p>
                      <div className="card-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() => startFocusSession(task)}
                        >
                          {t.actions.startNow}
                        </button>
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={() => updateTask(task.id, { status: 'done', todayFocus: false })}
                        >
                          {t.actions.markDone}
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="empty-state">
                  <h3>{t.focusEmptyTitle}</h3>
                  <p>{t.focusEmptyText}</p>
                  <div className="empty-actions">
                    <a className="secondary-button" href="#quick-add">
                      {t.focusEmptyAction}
                    </a>
                    <button className="ghost-button" type="button" onClick={() => applyTemplate('paper')}>
                      {t.focusEmptyTemplate}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="panel tasks-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">{t.libraryEyebrow}</p>
              <h2>{t.libraryTitle}</h2>
            </div>
            <div className="tasks-total">{t.librarySummary(metrics.completed, metrics.total)}</div>
          </div>

          <div className="filters-grid">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.filters.searchPlaceholder}
            />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">{t.filters.allStatuses}</option>
              {Object.entries(t.statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select value={effortFilter} onChange={(event) => setEffortFilter(event.target.value)}>
              <option value="all">{t.filters.allEfforts}</option>
              {Object.entries(t.effortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
              <option value="all">{t.filters.allCourses}</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="task-grid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const dueState = getDueState(task);

                return (
                  <article className="task-card" key={task.id}>
                    <div className="task-topline">
                      <div className="task-tags">
                        <span className="chip">{task.course || t.defaultCourse}</span>
                        <span className={`chip tone-${task.effort}`}>{t.effortLabels[task.effort]}</span>
                        <span className={`chip status-${task.status}`}>{t.statusLabels[task.status]}</span>
                      </div>
                      <button
                        className={`pin-button ${task.todayFocus ? 'active' : ''}`}
                        type="button"
                        onClick={() => updateTask(task.id, { todayFocus: !task.todayFocus })}
                      >
                        {task.todayFocus ? t.actions.focusedToday : t.actions.addToFocus}
                      </button>
                    </div>

                    <h3>{task.title}</h3>
                    <p className="task-step">{task.nextStep || t.taskFallback}</p>

                    <div className="task-footline">
                      <span>
                        {dueState
                          ? dueState.label
                          : formatDueDate(task.dueDate, t.locale, t.noDeadline)}
                      </span>
                      <span>{task.todayFocus ? t.taskAvailabilityFocused : t.taskAvailabilityOpen}</span>
                    </div>

                    <div className="card-actions wrap">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => startFocusSession(task)}
                      >
                        {t.actions.startNow}
                      </button>
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() =>
                          updateTask(task.id, {
                            status: task.status === 'done' ? 'todo' : 'done',
                            todayFocus: task.status === 'done' ? task.todayFocus : false,
                          })
                        }
                      >
                        {task.status === 'done' ? t.actions.reopen : t.actions.complete}
                      </button>
                      <button className="ghost-button" type="button" onClick={() => handleEdit(task)}>
                        {t.actions.edit}
                      </button>
                      <button className="ghost-button danger" type="button" onClick={() => deleteTask(task.id)}>
                        {t.actions.delete}
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="empty-state full-width">
                <h3>{t.emptyFilterTitle}</h3>
                <p>{t.emptyFilterText}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
