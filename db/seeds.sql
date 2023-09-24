INSERT INTO
    departments (
        dpmt_name
    )
VALUES
    ('Director'),
    ('Accounting'),
    ('Marketing'),
    ('Production, and Operation');

INSERT INTO
    roles (
        title,
        salary,
        departments_id
    )
VALUES
    ('Director', 0, 1),
    ('Accounting-Head', 200000, 2),
    ('Marketing-Head', 200000, 3),
    ('Production-Head', 1600000, 4),
    ('Operation-Head', 160000, 4);

INSERT INTO
    employees (
        first_name,
        last_name,
        manager_id,
        roles_id,
        departments_id
    )
VALUES
    ('John', 'Dee', 1, 1, 1),
    ('John', 'Anderson', 2, 1, 2),
    ('Gary', 'Anderson', 3, 1, 3),
    ('Huifta', 'Gunners', 4, 1, 4),
    ('Melody', 'Gunners', 5, 1, 4);
