(function () {
  var MIN_LENGTH = 6;
  var cfg = window.__PS_AUTH__;

  function show(id) {
    ['panel-loading', 'panel-missing', 'panel-invalid', 'panel-done', 'panel-form'].forEach(function (x) {
      var el = document.getElementById(x);
      if (el) el.classList.toggle('hidden', x !== id);
    });
  }

  function setError(msg) {
    var el = document.getElementById('form-error');
    if (!el) return;
    if (!msg) {
      el.classList.add('hidden');
      el.textContent = '';
      return;
    }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  if (!cfg || !cfg.url || !cfg.key) {
    show('panel-missing');
    return;
  }

  var supabase = window.supabase.createClient(cfg.url, cfg.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });

  document.getElementById('btn-open-app').addEventListener('click', function () {
    window.location.href = (cfg.scheme || 'plusstation-app') + '://';
  });

  async function boot() {
    var hash = (window.location.hash || '').replace(/^#/, '');
    if (hash.indexOf('access_token') !== -1) {
      var params = new URLSearchParams(hash);
      var access_token = params.get('access_token');
      var refresh_token = params.get('refresh_token');
      var type = params.get('type');
      if (type === 'recovery' && access_token && refresh_token) {
        var sessionRes = await supabase.auth.setSession({ access_token: access_token, refresh_token: refresh_token });
        if (!sessionRes.error) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          show('panel-form');
          return;
        }
      }
    }

    var q = new URLSearchParams(window.location.search);
    var token_hash = q.get('token_hash');
    var qType = q.get('type');
    if (token_hash && qType === 'recovery') {
      var otpRes = await supabase.auth.verifyOtp({ token_hash: token_hash, type: 'recovery' });
      if (!otpRes.error) {
        window.history.replaceState(null, '', window.location.pathname);
        show('panel-form');
        return;
      }
    }

    var sess = await supabase.auth.getSession();
    if (sess.data && sess.data.session) {
      show('panel-form');
      return;
    }
    show('panel-invalid');
  }

  document.getElementById('form').addEventListener('submit', async function (e) {
    e.preventDefault();
    setError(null);
    var password = document.getElementById('password').value;
    var confirm = document.getElementById('confirm').value;
    if (password !== confirm) {
      setError('パスワードが一致しません。');
      return;
    }
    if (password.length < MIN_LENGTH) {
      setError('パスワードは' + MIN_LENGTH + '文字以上にしてください。');
      return;
    }
    var btn = document.getElementById('btn-save');
    btn.disabled = true;
    btn.textContent = '保存中…';
    try {
      var updateRes = await supabase.auth.updateUser({ password: password });
      if (updateRes.error) {
        var m = (updateRes.error.message || '').toLowerCase();
        if (m.indexOf('same') !== -1 || m.indexOf('different from') !== -1 || m.indexOf('identical') !== -1) {
          setError('以前と同じパスワードには変更できません。別のパスワードを入力してください。');
        } else {
          setError(updateRes.error.message);
        }
        return;
      }
      await supabase.auth.signOut();
      show('panel-done');
    } catch (err) {
      setError(err && err.message ? err.message : '更新に失敗しました。');
    } finally {
      btn.disabled = false;
      btn.textContent = 'パスワードを保存';
    }
  });

  boot().catch(function () {
    show('panel-invalid');
  });
})();
