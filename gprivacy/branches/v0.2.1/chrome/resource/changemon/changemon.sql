-- $Id: changemon.sql 41 2012-02-01 00:19:51Z hhofer69 $

create table if not exists changemon (
  ts      timestamp not null,
  engine  text      not null,
  what    text      not null,
  attr    text,
  oldv    text,
  newv    text,
  id      text,
  proto   text,
  host    text,
  path    text,
  query   text,
  doc     text,
  note    text
-- No primary keys and indices. This should make inserts faster!
);

create table if not exists ignore (
  engine  text,
  what    text,
  attr    text,
  oldv    text,
  newv    text,
  id      text,
  proto   text,
  host    text,
  path    text,
  query   text,
  doc     text,
  note    text
);
