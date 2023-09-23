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
        roles_id,
        departments_id,
        manager_id,
        is_manager
    )
VALUES
    ('John', 'Dee', 1, 1, 1, true),
    ('John', 'Anderson', 2, 2, 1, true),
    ('Gary', 'Anderson', 3, 3, 1, true),
    ('Huifta', 'Gunners', 4, 4, 1, true),
    ('Melody', 'Gunners', 5, 4, 1, true);