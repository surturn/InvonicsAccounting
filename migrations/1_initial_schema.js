/* eslint-disable camelcase */
exports.up = (pgm) => {

  pgm.createTable('users', {
    id:            { type: 'serial', primaryKey: true },
    email:         { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    name:          { type: 'varchar(255)', notNull: true },
    role:          { type: 'varchar(20)',  notNull: true, default: "'user'" },
    is_active:     { type: 'boolean',      notNull: true, default: true },
    created_at:    { type: 'timestamptz',  notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('companies', {
    id:         { type: 'serial',       primaryKey: true },
    name:       { type: 'varchar(255)', notNull: true },
    owner_id:   { type: 'integer',      references: '"users"', onDelete: 'CASCADE' },
    country:    { type: 'varchar(10)',  notNull: true, default: "'KE'" },
    currency:   { type: 'varchar(10)',  notNull: true, default: "'KES'" },
    tax_regime: { type: 'varchar(50)',  notNull: true, default: "'TOT'" },
    pin_number: { type: 'varchar(50)' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('accounts', {
    id:             { type: 'serial',      primaryKey: true },
    company_id:     { type: 'integer',     notNull: true, references: '"companies"', onDelete: 'CASCADE' },
    code:           { type: 'varchar(20)', notNull: true },
    name:           { type: 'varchar(255)',notNull: true },
    type:           { type: 'varchar(20)', notNull: true },
    normal_balance: { type: 'varchar(10)', notNull: true },
    is_turnover:    { type: 'boolean',     notNull: true, default: false },
    is_active:      { type: 'boolean',     notNull: true, default: true },
  });
  pgm.addConstraint('accounts', 'accounts_company_code_unique', 'UNIQUE (company_id, code)');

  pgm.createTable('parties', {
    id:         { type: 'serial',       primaryKey: true },
    company_id: { type: 'integer',      notNull: true, references: '"companies"', onDelete: 'CASCADE' },
    name:       { type: 'varchar(255)', notNull: true },
    type:       { type: 'varchar(20)',  notNull: true },
    email:      { type: 'varchar(255)' },
    phone:      { type: 'varchar(50)' },
    notes:      { type: 'text' },
  });

  pgm.createTable('fiscal_periods', {
    id:         { type: 'serial',       primaryKey: true },
    company_id: { type: 'integer',      notNull: true, references: '"companies"', onDelete: 'CASCADE' },
    name:       { type: 'varchar(100)', notNull: true },
    start_date: { type: 'date',         notNull: true },
    end_date:   { type: 'date',         notNull: true },
    is_locked:  { type: 'boolean',      notNull: true, default: false },
    locked_at:  { type: 'timestamptz' },
    locked_by:  { type: 'integer',      references: '"users"' },
  });

  pgm.createTable('tax_settings', {
    id:         { type: 'serial',       primaryKey: true },
    company_id: { type: 'integer',      notNull: true, references: '"companies"', onDelete: 'CASCADE' },
    name:       { type: 'varchar(100)', notNull: true },
    rate:       { type: 'numeric(10,4)',notNull: true },
    is_active:  { type: 'boolean',      notNull: true, default: true },
  });

  pgm.createTable('journal_entries', {
    id:          { type: 'serial',       primaryKey: true },
    company_id:  { type: 'integer',      notNull: true, references: '"companies"', onDelete: 'CASCADE' },
    reference:   { type: 'varchar(50)',  notNull: true, unique: true },
    date:        { type: 'date',         notNull: true },
    description: { type: 'text',         notNull: true },
    period_id:   { type: 'integer',      notNull: true, references: '"fiscal_periods"' },
    party_id:    { type: 'integer',      references: '"parties"' },
    created_by:  { type: 'integer',      notNull: true, references: '"users"' },
    is_void:     { type: 'boolean',      notNull: true, default: false },
    voided_at:   { type: 'timestamptz' },
    voided_by:   { type: 'integer',      references: '"users"' },
    void_reason: { type: 'text' },
    created_at:  { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('journal_lines', {
    id:         { type: 'serial',        primaryKey: true },
    entry_id:   { type: 'integer',       notNull: true, references: '"journal_entries"', onDelete: 'CASCADE' },
    account_id: { type: 'integer',       notNull: true, references: '"accounts"' },
    debit:      { type: 'numeric(15,2)', notNull: true, default: 0 },
    credit:     { type: 'numeric(15,2)', notNull: true, default: 0 },
  });

  pgm.createTable('attachments', {
    id:          { type: 'serial',       primaryKey: true },
    entry_id:    { type: 'integer',      notNull: true, references: '"journal_entries"', onDelete: 'CASCADE' },
    file_url:    { type: 'varchar(1000)',notNull: true },
    file_name:   { type: 'varchar(255)', notNull: true },
    uploaded_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('audit_log', {
    id:           { type: 'serial',      primaryKey: true },
    company_id:   { type: 'integer',     references: '"companies"' },
    table_name:   { type: 'varchar(100)',notNull: true },
    record_id:    { type: 'integer',     notNull: true },
    action:       { type: 'varchar(20)', notNull: true },
    old_values:   { type: 'jsonb' },
    new_values:   { type: 'jsonb' },
    performed_by: { type: 'integer',     notNull: true, references: '"users"' },
    created_at:   { type: 'timestamptz',notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('accounts',        'company_id');
  pgm.createIndex('accounts',        'code');
  pgm.createIndex('parties',         'company_id');
  pgm.createIndex('fiscal_periods',  'company_id');
  pgm.createIndex('journal_entries', 'company_id');
  pgm.createIndex('journal_entries', 'date');
  pgm.createIndex('journal_entries', 'period_id');
  pgm.createIndex('journal_lines',   'entry_id');
  pgm.createIndex('journal_lines',   'account_id');
  pgm.createIndex('audit_log',       'company_id');
};

exports.down = (pgm) => {
  pgm.dropTable('audit_log');
  pgm.dropTable('attachments');
  pgm.dropTable('journal_lines');
  pgm.dropTable('journal_entries');
  pgm.dropTable('tax_settings');
  pgm.dropTable('fiscal_periods');
  pgm.dropTable('parties');
  pgm.dropTable('accounts');
  pgm.dropTable('companies');
  pgm.dropTable('users');
};
