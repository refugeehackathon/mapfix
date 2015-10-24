create table tags (
  id serial,
  value text not null,

  created_at timestamp with time zone not null default now(),
  primary key (id)
);

insert into tags (value) values ('tag1'),('tag2');