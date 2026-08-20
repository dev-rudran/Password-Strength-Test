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

export default function App() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const { results, strength } = useMemo(() => analyze(password), [password])
  const suggestions = useMemo(() => buildSuggestions(password, results), [password, results])
  const isStrong = strength === 'strong'

  const handleClear = () => {
    setPassword('')
    setShow(false)
  }

  const level = strength === null ? 0 : strength === 'strong' ? 3 : strength === 'medium' ? 2 : 1

  return (
    <main className="container">
      <h1>Password Strength Checker</h1>
      <p className="subtitle">Check how secure your password is. It never leaves your browser.</p>

      <section className="card" aria-label="Password checker">
        <div className="field">
          <label htmlFor="password">Password</label>
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
              {show ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div className="meter-section">
          <div className="meter-label">
            <span>Password Strength</span>
            <span className={`strength strength-${strength ?? 'neutral'}`} aria-live="polite">
              {strength === null ? 'Enter a password' : `Password Strength: ${STRENGTH_LABELS[strength]}`}
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
            <div
              className={`meter-fill fill-${level}${strength ? ` fill-${strength}` : ''}`}
              style={{ width: `${(level / 3) * 100}%` }}
            />
          </div>
        </div>

        <ul className="checks" aria-label="Password requirements">
          {results.map(({ id, label, passed }) => (
            <li key={id} className={passed ? 'pass' : 'fail'}>
              <span className="icon" aria-hidden="true">{passed ? '✓' : '✕'}</span>
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
