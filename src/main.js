import './styles.css';
import { lessons } from './data/lessons.js';
import { createPythonRunner } from './runner.js';

const app = document.querySelector('#app');
const STORAGE_KEY = 'python-practice-progress-v1';
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
const defaultProgress = () => ({ opened: [], read: [], solved: {}, attempts: {}, failures: {}, inputTried: [] });

function appUrl(path = '/') {
  let route = path;
  if (BASE_PATH && route.startsWith(BASE_PATH)) route = route.slice(BASE_PATH.length) || '/';
  if (!route.startsWith('/')) route = `/${route}`;
  return `${BASE_PATH}${route}` || '/';
}

const pendingRoute = sessionStorage.getItem('python-practice-gh-pages-route');
if (pendingRoute) {
  sessionStorage.removeItem('python-practice-gh-pages-route');
  history.replaceState({}, '', appUrl(pendingRoute));
}

const state = {
  progress: loadProgress(),
  consoleParts: [],
  consoleError: null,
  waitingForInput: false,
  pyStatus: 'loading',
  mobilePanel: 'lesson',
  practiceResult: null,
  activeCheck: null,
  practiceIndex: 0,
};

function loadProgress() {
  try {
    return { ...defaultProgress(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return defaultProgress();
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function lessonById(id) {
  return lessons.find((lesson) => lesson.id === Number(id)) || lessons[0];
}

function routeInfo() {
  let pathname = window.location.pathname;
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) pathname = pathname.slice(BASE_PATH.length) || '/';
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/intro') return { page: 'intro' };
  const match = path.match(/^\/lesson\/(\d+)(\/practice)?$/);
  if (match) return { page: match[2] ? 'practice' : 'lesson', id: Number(match[1]) };
  return { page: 'home' };
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const toggle = document.querySelector('[data-action="theme"]');
  if (toggle) toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

const savedTheme = localStorage.getItem('python-practice-theme');
applyTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

function hasItem(list, item) {
  return Array.isArray(list) && list.includes(item);
}

function addUnique(list, item) {
  if (!list.includes(item)) list.push(item);
}

function solvedCount(lesson) {
  return (state.progress.solved[lesson.id] || []).length;
}

function progressLabel(lesson) {
  const complete = (hasItem(state.progress.read, lesson.id) ? 1 : 0) + solvedCount(lesson);
  const total = lesson.id === 7 ? 2 : 11;
  return { complete, total, percent: Math.round((complete / total) * 100) };
}

function readLesson(lesson) {
  addUnique(state.progress.opened, lesson.id);
  addUnique(state.progress.read, lesson.id);
  saveProgress();
}

function headerMarkup() {
  return `<header class="site-header">
    <a class="brand" href="${appUrl('/')}" data-nav aria-label="Python Practice home"><span class="brand-mark">Py</span><span>Python Practice</span></a>
    <nav class="header-actions" aria-label="Main navigation">
      <a class="quiet-link" href="${appUrl('/intro')}" data-nav>How to use this site</a>
      <button class="button button-quiet theme-toggle" type="button" data-action="theme">${document.documentElement.dataset.theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
    </nav>
  </header>`;
}

function footerMarkup() {
  return `<footer class="site-footer"><span>Small steps. Real Python.</span><button class="text-button" type="button" data-action="reset-open">Reset progress</button></footer>`;
}

function helpMarkup() {
  return `<button class="help-fab" type="button" data-action="help-open">Help me</button>
    <dialog class="help-drawer" id="help-dialog" aria-labelledby="help-title">
      <div class="drawer-head"><div><p class="eyebrow">A little help</p><h2 id="help-title">Let’s untangle it.</h2></div><button class="icon-button" type="button" data-action="help-close" aria-label="Close help">×</button></div>
      <div class="quick-replies" aria-label="Quick help options">
        <button class="button button-outline" type="button" data-action="help-quick" data-kind="confused">I’m confused</button>
        <button class="button button-outline" type="button" data-action="help-quick" data-kind="simple">Explain simpler</button>
        <button class="button button-outline" type="button" data-action="help-quick" data-kind="deeper">Give a deeper example</button>
      </div>
      <div class="help-answer" id="help-answer" aria-live="polite">Pick a question above, or ask about the lesson you’re viewing.</div>
      <form class="help-form" id="help-form"><label for="help-question">Ask about this lesson</label><textarea id="help-question" rows="3" placeholder="What would you like to understand?"></textarea><button class="button button-primary" type="submit">Ask</button></form>
    </dialog>
    <dialog class="confirm-dialog" id="reset-dialog" aria-labelledby="reset-title">
      <h2 id="reset-title">Reset all progress?</h2><p>Your saved lesson progress, solved problems, and attempts will be cleared.</p>
      <div class="dialog-actions"><button class="button button-outline" type="button" data-action="reset-cancel">Keep progress</button><button class="button button-danger" type="button" data-action="reset-confirm">Reset progress</button></div>
    </dialog>`;
}

function progressBar(lesson) {
  const progress = progressLabel(lesson);
  return `<div class="progress-meta"><span>${progress.complete} of ${progress.total} complete</span><span>${progress.percent}%</span></div><div class="progress-track" role="progressbar" aria-label="${escapeHtml(lesson.title)} progress" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.complete}"><span style="width:${progress.percent}%"></span></div>`;
}

function homeMarkup() {
  return `<main class="page-wrap home-page">
    <section class="welcome-row"><div><p class="eyebrow">Your first steps in Python</p><h1>Learn by making<br><span>something work.</span></h1><p class="welcome-copy">A calm, hands-on path from your first variable to a tiny bank system.</p></div><div class="welcome-stamp" aria-hidden="true"><span>01</span><small>learn<br>by doing</small></div></section>
    <a class="intro-card" href="${appUrl('/intro')}" data-nav><span class="intro-icon" aria-hidden="true">↗</span><span><strong>How to use this site</strong><small>A quick guide to the editor, console, and practice.</small></span><span class="card-arrow" aria-hidden="true">→</span></a>
    <div class="section-heading"><div><p class="eyebrow">The learning path</p><h2>Seven lessons, one step at a time</h2></div><span class="path-count">01 — 07</span></div>
    <section class="lesson-list" aria-label="Lessons">${lessons.map((lesson) => {
      const progress = progressLabel(lesson);
      const started = hasItem(state.progress.opened, lesson.id);
      return `<article class="lesson-card">
        <div class="lesson-number">${String(lesson.id).padStart(2, '0')}</div>
        <div class="lesson-summary"><p class="eyebrow">${lesson.id === 7 ? 'Capstone' : `Lesson ${lesson.id}`}</p><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.description)}</p></div>
        <div class="lesson-progress">${progressBar(lesson)}</div>
        <a class="button ${progress.complete ? 'button-outline' : 'button-primary'} lesson-start" href="${appUrl(`/lesson/${lesson.id}`)}" data-nav>${started ? 'Continue' : 'Start'} <span aria-hidden="true">→</span></a>
      </article>`;
    }).join('')}</section>
  </main>`;
}

function introMarkup() {
  const steps = [
    ['01', 'Read the explanation', 'Each lesson introduces one idea in short sections. Keep the Key points nearby as you work.'],
    ['02', 'Edit and run code', 'Change the example, then press Run. Ctrl+Enter (or Cmd+Enter) also runs the code.'],
    ['03', 'Read the console', 'Printed results appear in the console. When Python asks a question, type right there and press Enter.'],
    ['04', 'Try the practice', 'Solve one problem at a time. Check my answer compares what your code prints with the expected result.'],
    ['05', 'Ask for help', 'Use Help me for a simpler explanation, a deeper example, or a quick answer about the current lesson.'],
  ];
  return `<main class="page-wrap narrow-page intro-page"><a class="back-link" href="${appUrl('/')}" data-nav>← All lessons</a><p class="eyebrow">Before you begin</p><h1>How to use this site</h1><p class="page-lead">You can learn at your own pace. Try things, read what Python says, and adjust your code.</p>
    <ol class="intro-steps">${steps.map(([number, title, body]) => `<li><span class="step-number">${number}</span><div><h2>${title}</h2><p>${body}</p></div></li>`).join('')}</ol>
    <a class="button button-primary intro-start" href="${appUrl('/lesson/1')}" data-nav>Start Lesson 1 <span aria-hidden="true">→</span></a>
  </main>`;
}

function editorMarkup(id, value, label) {
  const lineCount = Math.max(1, value.split('\n').length);
  return `<div class="code-editor"><div class="line-numbers" id="${id}-lines" aria-hidden="true">${Array.from({ length: lineCount }, (_, index) => index + 1).join('<br>')}</div><label class="sr-only" for="${id}">${label}</label><textarea id="${id}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off">${escapeHtml(value)}</textarea></div>`;
}

function consoleMarkup(id) {
  const hasParts = state.consoleParts.length > 0;
  const output = hasParts
      ? state.consoleParts.map((part) => `<span class="${part.kind === 'input' ? 'terminal-typed' : ''}">${escapeHtml(part.text)}</span>`).join('')
    : `<span class="console-placeholder">${state.pyStatus === 'loading' ? 'Loading Python...' : state.pyStatus === 'failed' ? "Python couldn't load. Check your internet connection and refresh the page." : 'Your output will appear here.'}</span>`;
  const isolationNote = !window.crossOriginIsolated ? '<p class="console-notice">Interactive input isn\'t available in this browser. Try a different browser or refresh the page.</p>' : '';
  const error = state.consoleError ? `<div class="console-error"><p>${escapeHtml(state.consoleError.friendly)}</p>${state.consoleError.original ? `<small>${escapeHtml(state.consoleError.original)}</small>` : ''}</div>` : '';
  const input = state.waitingForInput ? '<input id="terminal-input" class="terminal-input" aria-label="Type your Python input and press Enter" autocomplete="off" autocapitalize="off" spellcheck="false"><span class="cursor-blink" aria-hidden="true"></span>' : '';
  return `<div class="console-shell"><div class="console-topline"><span class="console-label"><i aria-hidden="true"></i> Console</span><button class="console-clear" type="button" data-action="console-clear" aria-label="Clear console">Clear</button></div><div id="${id}" class="console-body" role="log" aria-live="polite" tabindex="0"><div class="console-output">${output}${input}</div>${error}${isolationNote}</div></div>`;
}

function lessonMarkup(lesson) {
  readLesson(lesson);
  const inputUnavailable = !window.crossOriginIsolated;
  const mobileTabs = `<div class="mobile-tabs" role="tablist" aria-label="Lesson panels">${[['lesson', 'Lesson'], ['code', 'Code'], ['console', 'Console']].map(([panel, label]) => `<button type="button" role="tab" aria-selected="${state.mobilePanel === panel}" class="mobile-tab ${state.mobilePanel === panel ? 'is-active' : ''}" data-action="mobile-tab" data-panel="${panel}">${label}</button>`).join('')}</div>`;
  return `<main class="page-wrap lesson-page">
    <a class="back-link" href="${appUrl('/')}" data-nav>← All lessons</a>
    <div class="lesson-title-row"><div><p class="eyebrow">Lesson ${lesson.id} of 7</p><h1>${escapeHtml(lesson.title)}</h1><p class="page-lead">${escapeHtml(lesson.description)}</p></div><a class="button button-outline practice-shortcut" href="${appUrl(`/lesson/${lesson.id}/practice`)}" data-nav>Go to practice <span aria-hidden="true">→</span></a></div>
    ${mobileTabs}
    <div class="lesson-panels">
      <section class="panel theory-panel ${state.mobilePanel === 'lesson' ? 'mobile-active' : ''}" data-mobile-panel="lesson" aria-label="Lesson explanation"><div class="panel-heading"><span class="panel-index">01</span><h2>Understand it</h2></div><div class="lesson-sections">${lesson.sections.map((section) => `<section><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.body)}</p></section>`).join('')}</div><aside class="key-points"><h3>Key points</h3><ul>${lesson.keyPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></aside><a class="button button-primary full-button" href="${appUrl(`/lesson/${lesson.id}/practice`)}" data-nav>Go to practice <span aria-hidden="true">→</span></a></section>
      <section class="panel editor-panel ${state.mobilePanel === 'code' ? 'mobile-active' : ''}" data-mobile-panel="code" aria-label="Python code editor"><div class="panel-heading"><span class="panel-index">02</span><h2>Make it yours</h2></div><div class="editor-caption"><span>example.py</span><span>Python 3</span></div>${editorMarkup('lesson-editor', lesson.exampleCode, 'Python code')}<div class="editor-actions"><button class="button button-primary" type="button" data-action="lesson-run" ${state.pyStatus !== 'ready' ? 'disabled' : ''}>Run <span aria-hidden="true">▶</span></button><button class="button button-outline" type="button" data-action="lesson-reset">Reset</button><button class="button button-outline input-button" type="button" data-action="lesson-input" ${inputUnavailable || state.pyStatus !== 'ready' ? 'disabled' : ''}>Try with input</button></div><p class="editor-note">${escapeHtml(lesson.inputDemoNote)}</p></section>
      <section class="panel console-panel ${state.mobilePanel === 'console' ? 'mobile-active' : ''}" data-mobile-panel="console" aria-label="Python console"><div class="panel-heading"><span class="panel-index">03</span><h2>See what happens</h2></div>${consoleMarkup('lesson-console')}</section>
    </div>
    <nav class="lesson-nav" aria-label="Lesson navigation">${lesson.id > 1 ? `<a class="button button-outline" href="${appUrl(`/lesson/${lesson.id - 1}`)}" data-nav>← Previous lesson</a>` : '<span></span>'}${lesson.id < 7 ? `<a class="button button-outline" href="${appUrl(`/lesson/${lesson.id + 1}`)}" data-nav>Next lesson →</a>` : `<a class="button button-primary" href="${appUrl('/lesson/7/practice')}" data-nav>Final challenge →</a>`}</nav>
  </main>`;
}

function attemptCount(lessonId, index) {
  return state.progress.attempts[lessonId]?.[index] || 0;
}

function failureCount(lessonId, index) {
  return state.progress.failures[lessonId]?.[index] || 0;
}

function practiceMarkup(lesson) {
  const total = lesson.problems.length;
  const solved = state.progress.solved[lesson.id] || [];
  const firstUnsolved = lesson.problems.findIndex((_, index) => !solved.includes(index));
  const index = state.practiceIndex || (firstUnsolved < 0 ? total : firstUnsolved);
  state.practiceIndex = index;
  if (index >= total) return practiceSummaryMarkup(lesson, solved.length, total);
  const problem = lesson.problems[index];
  const attempts = attemptCount(lesson.id, index);
  const failures = failureCount(lesson.id, index);
  const hintIndex = state.hintIndex || 0;
  const hintContent = hintIndex ? `<aside class="hint-box"><span class="hint-kicker">Hint ${hintIndex} of 2</span><p>${escapeHtml(problem.hints[hintIndex - 1])}</p></aside>` : '';
  const result = state.practiceResult?.index === index ? practiceFeedbackMarkup(state.practiceResult) : '';
  return `<main class="page-wrap practice-page"><a class="back-link" href="${appUrl(`/lesson/${lesson.id}`)}" data-nav>← Back to lesson</a><div class="practice-heading"><div><p class="eyebrow">${lesson.id === 7 ? 'Course challenge' : `Lesson ${lesson.id} practice`}</p><h1>${escapeHtml(lesson.title)}</h1></div><div class="problem-count"><strong>Problem ${index + 1} of ${total}</strong><span>${solved.length} solved</span></div></div>
    <div class="practice-layout"><section class="panel practice-editor-panel"><div class="panel-heading"><span class="panel-index">${String(index + 1).padStart(2, '0')}</span><h2>Try it yourself</h2></div><p class="problem-prompt">${escapeHtml(problem.prompt)}</p><div class="editor-caption"><span>answer.py</span><span>Attempt ${attempts}</span></div>${editorMarkup('practice-editor', problem.starterCode, 'Your Python answer')}<div class="practice-actions"><button class="button button-primary" type="button" data-action="practice-check" ${state.pyStatus !== 'ready' ? 'disabled' : ''}>Check my answer</button><button class="button button-outline" type="button" data-action="practice-hint" ${hintIndex >= 2 ? 'disabled' : ''}>Hint${hintIndex ? ` (${hintIndex}/2)` : ''}</button><button class="button button-outline" type="button" data-action="practice-solution" ${failures < 2 ? 'disabled' : ''}>Show solution</button></div>${hintContent}<div id="practice-feedback" aria-live="polite">${result}</div>${state.showSolution ? `<aside class="solution-box"><h3>One solution</h3><pre><code>${escapeHtml(problem.solution)}</code></pre></aside>` : ''}</section>
      <section class="panel practice-console-panel"><div class="panel-heading"><span class="panel-index">02</span><h2>Your output</h2></div>${consoleMarkup('practice-console')}<p class="practice-note">Practice problems do not use input().</p></section></div>
    </main>`;
}

function practiceFeedbackMarkup(result) {
  if (result.kind === 'correct') return `<div class="feedback-success"><strong>Correct! Well done.</strong><a class="button button-primary" href="#" data-action="practice-next">Next <span aria-hidden="true">→</span></a></div>`;
  if (result.kind === 'empty') return `<div class="feedback-message feedback-wrong"><strong>Your code printed nothing. Use print() to show a result.</strong></div>`;
  if (result.kind === 'error') return `<div class="feedback-message feedback-wrong"><strong>${escapeHtml(result.friendly)}</strong><small>${escapeHtml(result.original)}</small></div>`;
  return `<div class="feedback-wrong"><strong>Not quite.</strong><div class="output-comparison"><section><h3>Your output</h3><pre>${escapeHtml(result.actual || '(nothing)')}</pre></section><section><h3>Expected output</h3><pre>${escapeHtml(result.expected)}</pre></section></div></div>`;
}

function practiceSummaryMarkup(lesson, score, total) {
  return `<main class="page-wrap narrow-page summary-page"><div class="summary-mark" aria-hidden="true">✓</div><p class="eyebrow">${lesson.id === 7 ? 'Course complete' : 'Practice complete'}</p><h1>${lesson.id === 7 ? 'You finished the course!' : 'You did it.'}</h1><p class="page-lead">You solved ${score} of ${total} ${total === 1 ? 'problem' : 'problems'} in ${escapeHtml(lesson.title)}.</p><a class="button button-primary" href="${appUrl('/')}" data-nav>Back to lesson list <span aria-hidden="true">→</span></a></main>`;
}

function friendlyError(message) {
  const text = String(message || 'Python reported an error.');
  if (/IndentationError/.test(text)) return { friendly: 'Lines inside an if, for, or while must be indented the same amount.', original: text };
  if (/SyntaxError/.test(text)) return { friendly: "Something in the code is written in a way Python doesn't understand. Check for a missing colon, quote, or bracket.", original: text };
  if (/NameError/.test(text)) {
    const name = text.match(/name ['"]([^'"]+)['"] is not defined/i)?.[1] || 'that variable';
    return { friendly: `Python doesn't know the name '${name}'. Check the spelling of the variable.`, original: text };
  }
  if (/ZeroDivisionError/.test(text)) return { friendly: "You can't divide by zero.", original: text };
  if (/ValueError/.test(text)) return { friendly: 'Python expected a number here. Type only digits, like 12.', original: text };
  if (/TypeError/.test(text)) return { friendly: "Python can't combine these kinds of values. Try converting with int(), str(), or float().", original: text };
  return { friendly: 'Python found a problem in this code.', original: text };
}

function currentLesson() {
  const route = routeInfo();
  return route.id ? lessonById(route.id) : lessons[0];
}

function render() {
  const route = routeInfo();
  let page;
  if (route.page === 'intro') page = introMarkup();
  else if (route.page === 'lesson') page = lessonMarkup(lessonById(route.id));
  else if (route.page === 'practice') page = practiceMarkup(lessonById(route.id));
  else page = homeMarkup();
  app.innerHTML = `${headerMarkup()}${page}${footerMarkup()}${helpMarkup()}`;
  attachEditorLineUpdates();
  updateRunnerControls();
}

function attachEditorLineUpdates() {
  document.querySelectorAll('.code-editor textarea').forEach((editor) => {
    editor.addEventListener('input', () => {
      const numbers = document.querySelector(`#${editor.id}-lines`);
      if (numbers) numbers.innerHTML = Array.from({ length: Math.max(1, editor.value.split('\n').length) }, (_, index) => index + 1).join('<br>');
    });
  });
}

function updateRunnerControls() {
  document.querySelectorAll('[data-action="lesson-run"], [data-action="practice-check"]').forEach((button) => {
    button.disabled = state.pyStatus !== 'ready' || pythonRunner.running;
  });
  document.querySelectorAll('[data-action="lesson-input"]').forEach((button) => {
    button.disabled = !window.crossOriginIsolated || state.pyStatus !== 'ready' || pythonRunner.running;
  });
}

function renderConsole() {
  const route = routeInfo();
  const id = document.querySelector('#lesson-console') ? 'lesson-console' : document.querySelector('#practice-console') ? 'practice-console' : null;
  if (!id) return;
  const panel = document.querySelector(`#${id}`)?.closest('.console-shell');
  if (!panel) return;
  panel.outerHTML = consoleMarkup(id);
  if (state.waitingForInput) requestAnimationFrame(() => document.querySelector('#terminal-input')?.focus());
  updateRunnerControls();
}

function appendConsole(text, kind = 'text') {
  state.consoleParts.push({ text, kind });
  renderConsole();
}

function updatePracticeFeedback() {
  const target = document.querySelector('#practice-feedback');
  if (target) target.innerHTML = state.practiceResult ? practiceFeedbackMarkup(state.practiceResult) : '';
  const route = routeInfo();
  const lesson = lessonById(route.id);
  const index = state.practiceIndex;
  const solutionButton = document.querySelector('[data-action="practice-solution"]');
  if (solutionButton) solutionButton.disabled = failureCount(lesson.id, index) < 2;
  const attemptLabel = document.querySelector('.editor-caption span:nth-child(2)');
  if (attemptLabel) attemptLabel.textContent = `Attempt ${attemptCount(lesson.id, index)}`;
}

function recordFailedCheck(lessonId, index) {
  state.progress.attempts[lessonId] ||= {};
  state.progress.failures[lessonId] ||= {};
  state.progress.attempts[lessonId][index] = (state.progress.attempts[lessonId][index] || 0) + 1;
  state.progress.failures[lessonId][index] = (state.progress.failures[lessonId][index] || 0) + 1;
  saveProgress();
}

function handleCheckResult(event) {
  const check = state.activeCheck;
  if (!check) return;
  state.activeCheck = null;
  state.waitingForInput = false;
  const lesson = lessonById(check.lessonId);
  const problem = lesson.problems[check.index];
  const output = state.consoleParts.map((part) => part.text).join('').trim();
  if (event.type === 'done' && output === problem.expectedOutput.trim()) {
    state.progress.attempts[lesson.id] ||= {};
    state.progress.attempts[lesson.id][check.index] = (state.progress.attempts[lesson.id][check.index] || 0) + 1;
    state.progress.solved[lesson.id] ||= [];
    addUnique(state.progress.solved[lesson.id], check.index);
    saveProgress();
    state.practiceResult = { kind: 'correct', index: check.index };
  } else if (event.type === 'error' || event.type === 'timeout' || event.type === 'stopped') {
    recordFailedCheck(lesson.id, check.index);
    const timeoutMessage = "This code took too long. Check your loop's stopping condition.";
    const translated = event.type === 'timeout'
      ? { friendly: timeoutMessage, original: timeoutMessage }
      : friendlyError(event.message || 'Program stopped.');
    state.practiceResult = { kind: 'error', index: check.index, ...translated };
    state.consoleError = translated;
  } else if (!output) {
    recordFailedCheck(lesson.id, check.index);
    state.practiceResult = { kind: 'empty', index: check.index };
  } else {
    recordFailedCheck(lesson.id, check.index);
    state.practiceResult = { kind: 'wrong', index: check.index, actual: output, expected: problem.expectedOutput };
  }
  renderConsole();
  updatePracticeFeedback();
}

function handleRunnerEvent(event) {
  if (event.type === 'loading') {
    state.pyStatus = 'loading';
    renderConsole();
  }
  if (event.type === 'ready') {
    state.pyStatus = 'ready';
    renderConsole();
  }
  if (event.type === 'load-error') {
    state.pyStatus = 'failed';
    state.consoleParts = [{ text: "Python couldn't load. Check your internet connection and refresh the page.", kind: 'text' }];
    renderConsole();
  }
  if (event.type === 'output') appendConsole(event.text, 'text');
  if (event.type === 'input-request') {
    state.waitingForInput = true;
    renderConsole();
  }
  if (event.type === 'done') {
    state.waitingForInput = false;
    renderConsole();
    if (state.activeCheck) handleCheckResult(event);
  }
  if (event.type === 'error') {
    state.waitingForInput = false;
    state.consoleError = friendlyError(event.message);
    renderConsole();
    if (state.activeCheck) handleCheckResult(event);
  }
  if (event.type === 'timeout') {
    state.waitingForInput = false;
    appendConsole("This code took too long. Check your loop's stopping condition.\n");
    if (state.activeCheck) handleCheckResult(event);
  }
  if (event.type === 'stopped') {
    state.waitingForInput = false;
    appendConsole('Program stopped.\n');
    if (state.activeCheck) handleCheckResult(event);
  }
  updateRunnerControls();
}

const pythonRunner = createPythonRunner(handleRunnerEvent);

function clearConsole() {
  state.consoleParts = [];
  state.consoleError = null;
  renderConsole();
}

function navigate(path) {
  if (pythonRunner.running) pythonRunner.cancel({ restart: true });
  state.waitingForInput = false;
  state.activeCheck = null;
  state.practiceResult = null;
  state.consoleParts = [];
  state.consoleError = null;
  state.mobilePanel = 'lesson';
  state.practiceIndex = 0;
  state.hintIndex = 0;
  state.showSolution = false;
  history.pushState({}, '', appUrl(path));
  render();
  window.scrollTo(0, 0);
}

function editorValue(id) {
  return document.querySelector(`#${id}`)?.value || '';
}

function runLessonCode(code, interactive = true) {
  clearConsole();
  state.waitingForInput = false;
  if (interactive && !window.crossOriginIsolated && /\binput\s*\(/.test(code)) {
    state.consoleError = { friendly: "Interactive input isn't available in this browser. Try a different browser or refresh the page.", original: '' };
    renderConsole();
    return;
  }
  pythonRunner.run(code, { interactive });
  updateRunnerControls();
}

function checkPractice() {
  const route = routeInfo();
  const lesson = lessonById(route.id);
  const code = editorValue('practice-editor');
  clearConsole();
  state.practiceResult = null;
  const id = pythonRunner.run(code, { interactive: false });
  if (id !== null) state.activeCheck = { id, lessonId: lesson.id, index: state.practiceIndex };
  updateRunnerControls();
}

function activeHelpLesson() {
  const route = routeInfo();
  return route.id ? lessonById(route.id) : lessons[0];
}

function localHelpAnswer(question, lesson) {
  const normalized = question.toLowerCase().replace(/[^a-z0-9_]+/g, ' ').trim();
  const terms = normalized.split(/\s+/).filter((word) => word.length > 2);
  const matches = lesson.sections.filter((section) => {
    const content = `${section.heading} ${section.body}`.toLowerCase();
    return terms.some((term) => new RegExp(`\\b${term}\\b`).test(content));
  });
  if (matches.length) return matches.map((section) => `${section.heading}: ${section.body}`).join('\n\n');
  return 'Try the quick buttons above, or re-read the lesson text for now.';
}

function showHelpAnswer(text) {
  const answer = document.querySelector('#help-answer');
  if (answer) answer.textContent = text;
}

app.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-nav]');
  if (link && link.origin === location.origin) {
    event.preventDefault();
    navigate(link.getAttribute('href'));
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const route = routeInfo();
  const lesson = route.id ? lessonById(route.id) : lessons[0];

  if (action === 'theme') {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('python-practice-theme', nextTheme);
    applyTheme(nextTheme);
  }
  if (action === 'help-open') document.querySelector('#help-dialog')?.showModal();
  if (action === 'help-close') document.querySelector('#help-dialog')?.close();
  if (action === 'help-quick') {
    const kind = button.dataset.kind;
    const reply = kind === 'deeper' ? lesson.deeper : kind === 'confused' ? `${lesson.simpler}\n\nTry re-reading the Key points in this lesson.` : lesson.simpler;
    showHelpAnswer(reply);
  }
  if (action === 'reset-open') document.querySelector('#reset-dialog')?.showModal();
  if (action === 'reset-cancel') document.querySelector('#reset-dialog')?.close();
  if (action === 'reset-confirm') {
    localStorage.removeItem(STORAGE_KEY);
    state.progress = defaultProgress();
    document.querySelector('#reset-dialog')?.close();
    history.replaceState({}, '', appUrl('/'));
    render();
  }
  if (action === 'mobile-tab') {
    state.mobilePanel = button.dataset.panel;
    document.querySelectorAll('[data-mobile-panel]').forEach((panel) => panel.classList.toggle('mobile-active', panel.dataset.mobilePanel === state.mobilePanel));
    document.querySelectorAll('.mobile-tab').forEach((tab) => {
      const selected = tab.dataset.panel === state.mobilePanel;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
  }
  if (action === 'lesson-run') runLessonCode(editorValue('lesson-editor'));
  if (action === 'lesson-reset') {
    if (pythonRunner.running) pythonRunner.cancel({ restart: true });
    const editor = document.querySelector('#lesson-editor');
    if (editor) editor.value = lesson.exampleCode;
    attachEditorLineUpdates();
    clearConsole();
    state.waitingForInput = false;
  }
  if (action === 'lesson-input') {
    const editor = document.querySelector('#lesson-editor');
    if (editor) editor.value = lesson.inputDemo;
    editor?.dispatchEvent(new Event('input'));
    state.progress.inputTried ||= [];
    addUnique(state.progress.inputTried, lesson.id);
    saveProgress();
    state.mobilePanel = 'code';
    document.querySelector('[data-action="mobile-tab"][data-panel="code"]')?.click();
  }
  if (action === 'console-clear') clearConsole();
  if (action === 'practice-check') checkPractice();
  if (action === 'practice-hint') {
    state.hintIndex = Math.min(2, (state.hintIndex || 0) + 1);
    render();
  }
  if (action === 'practice-solution') {
    if (failureCount(lesson.id, state.practiceIndex) >= 2) {
      state.showSolution = true;
      render();
    }
  }
  if (action === 'practice-next') {
    state.practiceIndex += 1;
    state.hintIndex = 0;
    state.showSolution = false;
    state.practiceResult = null;
    render();
    window.scrollTo(0, 0);
  }
});

app.addEventListener('submit', (event) => {
  if (event.target.id !== 'help-form') return;
  event.preventDefault();
  const question = document.querySelector('#help-question')?.value.trim();
  if (question) showHelpAnswer(localHelpAnswer(question, activeHelpLesson()));
});

app.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  }
  if (event.target.id === 'terminal-input' && event.key === 'Enter') {
    event.preventDefault();
    const input = event.target;
    const value = input.value;
    state.consoleParts.push({ text: `${value}\n`, kind: 'input' });
    state.waitingForInput = false;
    renderConsole();
    pythonRunner.submitInput(value);
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    const route = routeInfo();
    if (route.page === 'practice') checkPractice();
    if (route.page === 'lesson') runLessonCode(editorValue('lesson-editor'));
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && pythonRunner.running) {
    event.preventDefault();
    pythonRunner.stop();
  }
});

window.addEventListener('popstate', () => {
    if (pythonRunner.running) pythonRunner.cancel({ restart: true });
  state.consoleParts = [];
  state.consoleError = null;
  state.practiceIndex = 0;
  render();
});

render();