import { useMemo, useState } from 'react'

const CHECKS = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Uppercase letter',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'Lowercase letter',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'Number',
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: 'special',
    label: 'Special character',
    test: (p) => /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p),
  },
]

function analyze(password) {
  const results = CHECKS.map((check) => ({ ...check, passed: check.test(password) }))
  const score = results.filter((r) => r.passed).length

  let strength
  if (password.length === 0) {
    strength = null
  } else if (password.length < 8 || score <= 2) {
    strength = 'weak'
  } else if (score >= 5 && password.length >= 12) {
    strength = 'strong'
  } else {
    strength = 'medium'
  }

  return { results, score, strength }
}

function buildSuggestions(password, results) {
  const suggestions = []
  const passed = (id) => results.find((r) => r.id === id)?.passed

  if (!passed('length')) {
    suggestions.push('Make your password at least 8 characters long.')
  } else if (password.length < 12) {
    suggestions.push('Consider using 12+ characters for a stronger password.')
  }
  if (!passed('uppercase')) suggestions.push('Add an uppercase letter.')
  if (!passed('lowercase')) suggestions.push('Add a lowercase letter.')
  if (!passed('number')) suggestions.push('Add a number.')
  if (!passed('special')) suggestions.push('Add a special character.')

  return suggestions
}

const STRENGTH_LABELS = {
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
}

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
)

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export default function App() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const { results, strength } = useMemo(() => analyze(password), [password])
  const suggestions = useMemo(() => buildSuggestions(password, results), [password, results])
  const isStrong = strength === 'strong'
  const level = strength === null ? 0 : strength === 'strong' ? 3 : strength === 'medium' ? 2 : 1

  const handleClear = () => {
    setPassword('')
    setShow(false)
  }

  return (
    <main className="container">
      <div className="brand">
        <span className="brand-badge"><ShieldIcon /></span>
        <h1>Password Strength Checker</h1>
        <p className="subtitle">Check how secure your password is. It never leaves your browser.</p>
      </div>

      <section className="card" aria-label="Password checker">
        <div className="field">
          <div className="field-top">
            <label htmlFor="password">Password</label>
            <span className={`char-count${password.length > 0 ? ' has-value' : ''}`} aria-live="polite">
              {password.length === 0 ? '' : `${password.length} ${password.length === 1 ? 'character' : 'characters'}`}
            </span>
          </div>
          <div className="input-row">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              aria-pressed={show}
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="meter-section">
          <div className="meter-label">
            <span className="meter-title">Password Strength</span>
            <span className={`badge badge-${strength ?? 'neutral'}`} aria-live="polite">
              {strength === null ? 'Enter a password' : STRENGTH_LABELS[strength]}
            </span>
          </div>
          <div
            className="meter"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={level}
            aria-label="Password strength level"
          >
            {[1, 2, 3].map((seg) => (
              <div
                key={seg}
                className={`meter-seg${level >= seg ? ` active active-${strength}` : ''}`}
              />
            ))}
          </div>
          <div className="meter-scale" aria-hidden="true">
            <span>Weak</span>
            <span>Medium</span>
            <span>Strong</span>
          </div>
        </div>

        <ul className="checks" aria-label="Password requirements">
          {results.map(({ id, label, passed }, i) => (
            <li key={id} className={`${passed ? 'pass' : 'fail'} enter`} style={{ animationDelay: `${i * 50}ms` }}>
              <span className="icon" aria-hidden="true">{passed ? <CheckIcon /> : <CrossIcon />}</span>
              {label}
            </li>
          ))}
        </ul>

        <div className="suggestions">
          <h2>Suggestions</h2>
          <ul>
            {password.length === 0 ? (
              <li>Enter a password to see suggestions.</li>
            ) : isStrong ? (
              <li>Great! Your password meets the recommended requirements.</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li>Enter a password to see suggestions.</li>
            )}
          </ul>
        </div>

        <button type="button" className="clear" onClick={handleClear} disabled={password.length === 0}>
          Clear
        </button>
      </section>

      <footer>
        <p>Analysis runs locally in your browser. Your password is never stored, sent, or logged.</p>
      </footer>
    </main>
  )
}