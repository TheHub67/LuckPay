'use strict';
/* =======================================================
   LUCKPAY — Utilidades de interfaz compartidas
   ======================================================= */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

/* ---------- Toast ---------- */
let toastTimer;
function toast(message, isError){
  const el = $('#toast');
  if(!el) return;
  $('#toastText').textContent = message;
  el.classList.toggle('is-error', !!isError);
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3400);
}

/* ---------- Mobile nav (landing) ---------- */
function initMobileNav(){
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  if(!menuBtn || !mobileMenu) return;

  function closeMenu(){
    menuBtn.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded','false');
    document.body.classList.remove('is-locked');
  }
  menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('is-open');
    menuBtn.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if(window.innerWidth > 1020) closeMenu(); });
}

/* ---------- Panel sidebar (dashboards) ---------- */
function initPanelSidebar(){
  const btn = $('#panelMenuBtn');
  const sidebar = $('#panelSidebar');
  if(!btn || !sidebar) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('is-open'));
  document.addEventListener('click', e => {
    if(!sidebar.classList.contains('is-open')) return;
    if(sidebar.contains(e.target) || btn.contains(e.target)) return;
    sidebar.classList.remove('is-open');
  });
}

/* ---------- Scroll progress + to top (landing) ---------- */
function initScrollChrome(){
  const progress = $('#progress');
  const toTop = $('#toTop');
  if(!progress && !toTop) return;

  function onScroll(){
    const d = document.documentElement;
    const max = Math.max(1, d.scrollHeight - d.clientHeight);
    if(progress) progress.style.width = ((d.scrollTop / max) * 100) + '%';
    if(toTop) toTop.classList.toggle('is-visible', d.scrollTop > 650);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  toTop?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

/* ---------- Active nav on landing ---------- */
function initActiveNav(){
  if(!('IntersectionObserver' in window)) return;
  const navLinks = $$('#desktopNav a[data-section]');
  const sections = $$('main section[id]');
  if(!navLinks.length || !sections.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('is-active', link.dataset.section === entry.target.id));
    });
  }, {rootMargin:'-40% 0px -45% 0px'});
  sections.forEach(s => observer.observe(s));
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = $$('.reveal');
  if(!items.length) return;
  if(!prefersReduced && 'IntersectionObserver' in window){
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        ro.unobserve(entry.target);
      });
    }, {threshold:.12});
    items.forEach(el => ro.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }
}

/* ---------- Modals ---------- */
function openModal(id){
  const modal = $('#' + id);
  if(!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('is-locked');
  setTimeout(() => modal.querySelector('button')?.focus(), 40);
}
function closeModal(id){
  const modal = $('#' + id);
  if(!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  if(!$('.modal.is-open')) document.body.classList.remove('is-locked');
}
function initModals(){
  $$('.modal').forEach(modal => {
    modal.addEventListener('click', e => { if(e.target === modal) closeModal(modal.id); });
  });
  $$('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal));
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') $$('.modal.is-open').forEach(m => closeModal(m.id));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPanelSidebar();
  initScrollChrome();
  initActiveNav();
  initReveal();
  initModals();
});
